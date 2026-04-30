import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Tab = "chats" | "friends" | "requests" | "find";

interface Friend {
  user_id: string;
  username: string;
  status: "pending" | "accepted";
  isIncoming: boolean;
  friendshipId: string;
}

interface ConversationListItem {
  id: string;
  is_group: boolean;
  title: string | null;
  memberIds: string[];
  memberNames: Record<string, string>;
  lastMessage?: string;
  lastAt?: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface SocialProps {
  userId: string;
  username: string;
  onBack: () => void;
}

export default function Social({ userId, username, onBack }: SocialProps) {
  const [tab, setTab] = useState<Tab>("chats");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [blockedIds, setBlockedIds] = useState<Set<string>>(new Set());
  const [activeConv, setActiveConv] = useState<ConversationListItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<{ user_id: string; username: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ id: string; name: string } | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportEvidence, setReportEvidence] = useState<File | null>(null);
  const [reportEvidencePreview, setReportEvidencePreview] = useState<string | null>(null);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupSelected, setGroupSelected] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ---------- Loaders ----------
  const loadBlocks = useCallback(async () => {
    const { data } = await supabase
      .from("user_blocks")
      .select("blocked_id")
      .eq("blocker_id", userId);
    setBlockedIds(new Set((data || []).map((r) => r.blocked_id)));
  }, [userId]);

  const loadFriends = useCallback(async () => {
    const { data } = await supabase
      .from("friendships")
      .select("id, requester_id, addressee_id, status")
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);
    if (!data) return;
    const otherIds = data.map((f) => (f.requester_id === userId ? f.addressee_id : f.requester_id));
    const { data: namesData } = await supabase.rpc("get_usernames", { _ids: otherIds });
    const nameMap = new Map((namesData || []).map((u: any) => [u.user_id, u.username]));
    setFriends(
      data.map((f) => {
        const otherId = f.requester_id === userId ? f.addressee_id : f.requester_id;
        return {
          user_id: otherId,
          username: nameMap.get(otherId) || "Wizard",
          status: f.status as "pending" | "accepted",
          isIncoming: f.addressee_id === userId,
          friendshipId: f.id,
        };
      })
    );
  }, [userId]);

  const loadConversations = useCallback(async () => {
    // 1) Find conversations I belong to
    const { data: myMemberships } = await supabase
      .from("conversation_members")
      .select("conversation_id")
      .eq("user_id", userId);
    const convIds = (myMemberships || []).map((m) => m.conversation_id);
    if (convIds.length === 0) {
      setConversations([]);
      return;
    }

    const [{ data: convs }, { data: allMembers }] = await Promise.all([
      supabase.from("conversations").select("id, is_group, title").in("id", convIds),
      supabase.from("conversation_members").select("conversation_id, user_id").in("conversation_id", convIds),
    ]);

    const otherIds = Array.from(new Set((allMembers || []).map((m) => m.user_id).filter((id) => id !== userId)));
    const { data: names } = otherIds.length
      ? await supabase.rpc("get_usernames", { _ids: otherIds })
      : { data: [] as any };
    const nameMap = new Map<string, string>(((names as any[]) || []).map((u) => [u.user_id, u.username]));

    const list: ConversationListItem[] = (convs || []).map((c) => {
      const memberIds = (allMembers || []).filter((m) => m.conversation_id === c.id).map((m) => m.user_id);
      const memberNames: Record<string, string> = {};
      memberIds.forEach((id) => {
        memberNames[id] = id === userId ? username : nameMap.get(id) || "Wizard";
      });
      return { ...c, memberIds, memberNames };
    });
    setConversations(list);
  }, [userId, username]);

  useEffect(() => {
    loadBlocks();
    loadFriends();
    loadConversations();
  }, [loadBlocks, loadFriends, loadConversations]);

  // ---------- Realtime ----------
  useEffect(() => {
    const ch = supabase
      .channel("social-friendships")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "friendships" },
        () => loadFriends()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversation_members" },
        () => loadConversations()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [loadFriends, loadConversations]);

  // ---------- Active conversation messages ----------
  useEffect(() => {
    if (!activeConv) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", activeConv.id)
      .order("created_at", { ascending: true })
      .limit(200)
      .then(({ data }) => {
        if (!cancelled) setMessages((data || []) as Message[]);
      });

    const ch = supabase
      .channel(`msg-${activeConv.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeConv.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------- Actions ----------
  const doSearch = async () => {
    const q = search.trim();
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const { data } = await supabase.rpc("search_users_by_username", { _query: q });
    setSearching(false);
    setSearchResults((data || []).filter((r: any) => !blockedIds.has(r.user_id)));
  };

  const sendFriendRequest = async (addresseeId: string, name: string) => {
    const { error } = await supabase.from("friendships").insert({
      requester_id: userId,
      addressee_id: addresseeId,
      status: "pending",
    });
    if (error) {
      toast({ title: "Couldn't send request", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Friend request sent to ${name} ✨` });
      loadFriends();
    }
  };

  const respondRequest = async (friendshipId: string, accept: boolean) => {
    if (accept) {
      await supabase.from("friendships").update({ status: "accepted" }).eq("id", friendshipId);
    } else {
      await supabase.from("friendships").delete().eq("id", friendshipId);
    }
    loadFriends();
  };

  const removeFriend = async (friendshipId: string) => {
    await supabase.from("friendships").delete().eq("id", friendshipId);
    loadFriends();
  };

  const openOrCreateDM = async (otherId: string, otherName: string) => {
    // Look in already-loaded conversations for an existing 1-on-1 with this person
    const existing = conversations.find(
      (c) => !c.is_group && c.memberIds.length === 2 && c.memberIds.includes(otherId)
    );
    if (existing) {
      setActiveConv(existing);
      setTab("chats");
      return;
    }
    const { data: conv, error } = await supabase
      .from("conversations")
      .insert({ is_group: false, created_by: userId })
      .select()
      .single();
    if (error || !conv) {
      toast({ title: "Couldn't start chat", variant: "destructive" });
      return;
    }
    await supabase.from("conversation_members").insert([
      { conversation_id: conv.id, user_id: userId },
      { conversation_id: conv.id, user_id: otherId },
    ]);
    await loadConversations();
    const newConv: ConversationListItem = {
      id: conv.id,
      is_group: false,
      title: null,
      memberIds: [userId, otherId],
      memberNames: { [userId]: username, [otherId]: otherName },
    };
    setActiveConv(newConv);
    setTab("chats");
  };

  const createGroup = async () => {
    const ids = Array.from(groupSelected);
    if (ids.length < 1 || !groupName.trim()) {
      toast({ title: "Pick at least 1 friend and a name", variant: "destructive" });
      return;
    }
    const { data: conv, error } = await supabase
      .from("conversations")
      .insert({ is_group: true, title: groupName.trim().slice(0, 60), created_by: userId })
      .select()
      .single();
    if (error || !conv) {
      toast({ title: "Couldn't create group", variant: "destructive" });
      return;
    }
    await supabase.from("conversation_members").insert([
      { conversation_id: conv.id, user_id: userId },
      ...ids.map((id) => ({ conversation_id: conv.id, user_id: id })),
    ]);
    setShowNewGroup(false);
    setGroupName("");
    setGroupSelected(new Set());
    await loadConversations();
  };

  const sendMessage = async () => {
    const content = draft.trim();
    if (!content || !activeConv) return;
    setDraft("");
    const { error } = await supabase.from("messages").insert({
      conversation_id: activeConv.id,
      sender_id: userId,
      content: content.slice(0, 2000),
    });
    if (error) {
      toast({ title: "Couldn't send message", description: error.message, variant: "destructive" });
      setDraft(content);
    }
  };

  const closeReport = () => {
    setReportTarget(null);
    setReportReason("");
    setReportEvidence(null);
    if (reportEvidencePreview) URL.revokeObjectURL(reportEvidencePreview);
    setReportEvidencePreview(null);
    setReportSubmitting(false);
  };

  const pickEvidence = (file: File | null) => {
    if (reportEvidencePreview) URL.revokeObjectURL(reportEvidencePreview);
    if (!file) {
      setReportEvidence(null);
      setReportEvidencePreview(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast({ title: "Evidence must be an image", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image too large (max 5MB)", variant: "destructive" });
      return;
    }
    setReportEvidence(file);
    setReportEvidencePreview(URL.createObjectURL(file));
  };

  const submitReport = async () => {
    if (!reportTarget || !reportReason.trim() || !reportEvidence) return;
    setReportSubmitting(true);
    const ext = reportEvidence.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${userId}/${reportTarget.id}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("report-evidence")
      .upload(path, reportEvidence, { contentType: reportEvidence.type, upsert: false });
    if (upErr) {
      toast({ title: "Couldn't upload evidence", description: upErr.message, variant: "destructive" });
      setReportSubmitting(false);
      return;
    }
    const { error } = await supabase.from("user_reports").insert({
      reporter_id: userId,
      reported_id: reportTarget.id,
      reason: reportReason.trim().slice(0, 500),
      evidence_url: path,
    });
    if (error) {
      toast({ title: "Couldn't submit report", description: error.message, variant: "destructive" });
      setReportSubmitting(false);
      return;
    }
    toast({
      title: "Report submitted",
      description: "Evidence received. Repeat reports auto-block the user. 🛡️",
    });
    loadBlocks();
    closeReport();
  };

  const blockUser = async (id: string) => {
    await supabase.from("user_blocks").insert({ blocker_id: userId, blocked_id: id, reason: "manual" });
    loadBlocks();
    toast({ title: "User blocked" });
  };

  const unblockUser = async (id: string) => {
    await supabase.from("user_blocks").delete().eq("blocker_id", userId).eq("blocked_id", id);
    loadBlocks();
  };

  // ---------- Derived ----------
  const acceptedFriends = useMemo(
    () => friends.filter((f) => f.status === "accepted" && !blockedIds.has(f.user_id)),
    [friends, blockedIds]
  );
  const incomingRequests = useMemo(
    () => friends.filter((f) => f.status === "pending" && f.isIncoming),
    [friends]
  );
  const outgoingRequests = useMemo(
    () => friends.filter((f) => f.status === "pending" && !f.isIncoming),
    [friends]
  );

  const visibleConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (c.is_group) return true;
      const other = c.memberIds.find((id) => id !== userId);
      return other ? !blockedIds.has(other) : true;
    });
  }, [conversations, userId, blockedIds]);

  const convTitle = (c: ConversationListItem) => {
    if (c.is_group) return c.title || "Group chat";
    const otherId = c.memberIds.find((id) => id !== userId);
    return otherId ? c.memberNames[otherId] || "Wizard" : "Chat";
  };

  // ---------- Render ----------
  if (activeConv) {
    const otherIdForDM = !activeConv.is_group ? activeConv.memberIds.find((id) => id !== userId) : null;
    return (
      <div className="fixed inset-0 bg-background flex flex-col">
        <header className="flex items-center gap-2 p-3 border-b border-border">
          <button
            onClick={() => setActiveConv(null)}
            className="px-3 py-1.5 rounded-lg bg-secondary/60 border border-border hover:border-primary/30 text-sm font-display"
          >
            ← Back
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-lg truncate">{convTitle(activeConv)}</h2>
            {activeConv.is_group && (
              <p className="text-xs text-muted-foreground truncate">
                {activeConv.memberIds.map((id) => activeConv.memberNames[id]).join(", ")}
              </p>
            )}
          </div>
          {otherIdForDM && (
            <button
              onClick={() => setReportTarget({ id: otherIdForDM, name: activeConv.memberNames[otherIdForDM] })}
              className="px-3 py-1.5 rounded-lg bg-secondary/60 border border-destructive/30 text-destructive hover:border-destructive text-xs font-display"
              title="Report user"
            >
              🚩 Report
            </button>
          )}
        </header>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground mt-8">No messages yet. Say hello! 👋</p>
          )}
          {messages.map((m) => {
            const mine = m.sender_id === userId;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[78%] rounded-2xl px-3 py-2 ${
                    mine
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary/70 border border-border rounded-bl-sm"
                  }`}
                >
                  {!mine && activeConv.is_group && (
                    <p className="text-[10px] uppercase tracking-wide opacity-70 mb-0.5">
                      {activeConv.memberNames[m.sender_id] || "Wizard"}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-3 border-t border-border flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            maxLength={2000}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 rounded-xl bg-secondary/60 border border-border focus:border-primary outline-none text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!draft.trim()}
            className="px-4 py-2 rounded-xl btn-primary font-display text-sm disabled:opacity-40"
          >
            Send
          </button>
        </div>

        {reportTarget && (
          <ReportModal
            target={reportTarget}
            reason={reportReason}
            setReason={setReportReason}
            onCancel={() => {
              setReportTarget(null);
              setReportReason("");
            }}
            onSubmit={submitReport}
          />
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      <header className="flex items-center gap-2 p-3 border-b border-border">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-secondary/60 border border-border hover:border-primary/30 text-sm font-display"
        >
          ← Map
        </button>
        <h1 className="font-display text-xl flex-1">Owl Post 🦉</h1>
      </header>

      <nav className="flex border-b border-border">
        {([
          ["chats", "💬 Chats"],
          ["friends", "👥 Friends"],
          ["requests", `📨 Requests${incomingRequests.length ? ` (${incomingRequests.length})` : ""}`],
          ["find", "🔍 Find"],
        ] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-display transition ${
              tab === t ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {tab === "chats" && (
          <>
            <button
              onClick={() => setShowNewGroup(true)}
              className="w-full px-3 py-2 rounded-xl bg-secondary/60 border border-dashed border-border hover:border-primary/40 text-sm font-display"
            >
              ＋ New group chat
            </button>
            {visibleConversations.length === 0 && (
              <p className="text-center text-sm text-muted-foreground mt-8">
                No conversations yet. Start one from your friends list. 💌
              </p>
            )}
            {visibleConversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveConv(c)}
                className="w-full text-left p-3 rounded-xl bg-card border border-border hover:border-primary/40 transition"
              >
                <p className="font-display text-sm">
                  {c.is_group ? "👥 " : "💌 "}
                  {convTitle(c)}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {c.memberIds.length} member{c.memberIds.length === 1 ? "" : "s"}
                </p>
              </button>
            ))}
          </>
        )}

        {tab === "friends" && (
          <>
            {acceptedFriends.length === 0 && (
              <p className="text-center text-sm text-muted-foreground mt-8">
                No friends yet. Use 🔍 Find to search by username.
              </p>
            )}
            {acceptedFriends.map((f) => (
              <div key={f.friendshipId} className="p-3 rounded-xl bg-card border border-border flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm truncate">{f.username}</p>
                </div>
                <button
                  onClick={() => openOrCreateDM(f.user_id, f.username)}
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-display"
                >
                  Chat
                </button>
                <button
                  onClick={() => setReportTarget({ id: f.user_id, name: f.username })}
                  className="px-2 py-1.5 rounded-lg bg-secondary/60 border border-border text-xs"
                  title="Report"
                >
                  🚩
                </button>
                <button
                  onClick={() => removeFriend(f.friendshipId)}
                  className="px-2 py-1.5 rounded-lg bg-secondary/60 border border-border text-xs"
                  title="Remove friend"
                >
                  ✕
                </button>
              </div>
            ))}
            {blockedIds.size > 0 && (
              <div className="mt-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-display mb-2">Blocked</p>
                {Array.from(blockedIds).map((id) => (
                  <div key={id} className="p-2 rounded-lg bg-card/50 border border-border flex items-center gap-2">
                    <span className="text-xs flex-1 truncate text-muted-foreground">{id.slice(0, 8)}…</span>
                    <button
                      onClick={() => unblockUser(id)}
                      className="px-2 py-1 rounded text-xs bg-secondary/60 border border-border"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "requests" && (
          <>
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-display">Incoming</p>
            {incomingRequests.length === 0 && (
              <p className="text-sm text-muted-foreground">No incoming requests.</p>
            )}
            {incomingRequests.map((f) => (
              <div key={f.friendshipId} className="p-3 rounded-xl bg-card border border-border flex items-center gap-2">
                <p className="flex-1 font-display text-sm truncate">{f.username}</p>
                <button
                  onClick={() => respondRequest(f.friendshipId, true)}
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-display"
                >
                  Accept
                </button>
                <button
                  onClick={() => respondRequest(f.friendshipId, false)}
                  className="px-3 py-1.5 rounded-lg bg-secondary/60 border border-border text-xs font-display"
                >
                  Decline
                </button>
              </div>
            ))}
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-display mt-4">Sent</p>
            {outgoingRequests.length === 0 && <p className="text-sm text-muted-foreground">No pending sent requests.</p>}
            {outgoingRequests.map((f) => (
              <div key={f.friendshipId} className="p-3 rounded-xl bg-card border border-border flex items-center gap-2">
                <p className="flex-1 font-display text-sm truncate">{f.username}</p>
                <span className="text-xs text-muted-foreground">Pending…</span>
                <button
                  onClick={() => removeFriend(f.friendshipId)}
                  className="px-2 py-1.5 rounded-lg bg-secondary/60 border border-border text-xs"
                >
                  Cancel
                </button>
              </div>
            ))}
          </>
        )}

        {tab === "find" && (
          <>
            <div className="flex gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
                placeholder="Search by username..."
                className="flex-1 px-3 py-2 rounded-xl bg-secondary/60 border border-border focus:border-primary outline-none text-sm"
              />
              <button onClick={doSearch} className="px-4 py-2 rounded-xl btn-primary font-display text-sm">
                Search
              </button>
            </div>
            {searching && <p className="text-sm text-muted-foreground text-center mt-4">Searching…</p>}
            {!searching && search.trim().length >= 2 && searchResults.length === 0 && (
              <p className="text-sm text-muted-foreground text-center mt-4">No wizards found.</p>
            )}
            {searchResults.map((u) => {
              const existing = friends.find((f) => f.user_id === u.user_id);
              return (
                <div key={u.user_id} className="p-3 rounded-xl bg-card border border-border flex items-center gap-2">
                  <p className="flex-1 font-display text-sm truncate">{u.username}</p>
                  {existing ? (
                    <span className="text-xs text-muted-foreground">
                      {existing.status === "accepted" ? "Friends" : "Pending"}
                    </span>
                  ) : (
                    <button
                      onClick={() => sendFriendRequest(u.user_id, u.username)}
                      className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-display"
                    >
                      Add
                    </button>
                  )}
                  <button
                    onClick={() => blockUser(u.user_id)}
                    className="px-2 py-1.5 rounded-lg bg-secondary/60 border border-border text-xs"
                    title="Block"
                  >
                    🚫
                  </button>
                  <button
                    onClick={() => setReportTarget({ id: u.user_id, name: u.username })}
                    className="px-2 py-1.5 rounded-lg bg-secondary/60 border border-destructive/30 text-destructive text-xs"
                    title="Report"
                  >
                    🚩
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>

      {showNewGroup && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card-illustrated w-full max-w-md p-5">
            <h3 className="font-display text-lg mb-3">New group chat 👥</h3>
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
              maxLength={60}
              className="w-full px-3 py-2 mb-3 rounded-xl bg-secondary/60 border border-border focus:border-primary outline-none text-sm"
            />
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-display mb-2">Add friends</p>
            <div className="max-h-60 overflow-y-auto space-y-1 mb-4">
              {acceptedFriends.length === 0 && (
                <p className="text-sm text-muted-foreground">Add friends first to create a group.</p>
              )}
              {acceptedFriends.map((f) => {
                const checked = groupSelected.has(f.user_id);
                return (
                  <label
                    key={f.user_id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const next = new Set(groupSelected);
                        if (e.target.checked) next.add(f.user_id);
                        else next.delete(f.user_id);
                        setGroupSelected(next);
                      }}
                    />
                    <span className="text-sm">{f.username}</span>
                  </label>
                );
              })}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowNewGroup(false);
                  setGroupName("");
                  setGroupSelected(new Set());
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-secondary/60 border border-border text-sm font-display"
              >
                Cancel
              </button>
              <button onClick={createGroup} className="flex-1 px-3 py-2 rounded-xl btn-primary text-sm font-display">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {reportTarget && (
        <ReportModal
          target={reportTarget}
          reason={reportReason}
          setReason={setReportReason}
          onCancel={() => {
            setReportTarget(null);
            setReportReason("");
          }}
          onSubmit={submitReport}
        />
      )}
    </div>
  );
}

function ReportModal({
  target,
  reason,
  setReason,
  onCancel,
  onSubmit,
}: {
  target: { id: string; name: string };
  reason: string;
  setReason: (v: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="card-illustrated w-full max-w-md p-5">
        <h3 className="font-display text-lg mb-1">Report {target.name} 🚩</h3>
        <p className="text-xs text-muted-foreground mb-3">
          After 3 reports against the same user from you, they're auto-blocked. After 5 different reporters, they're
          flagged for moderator review.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={500}
          rows={4}
          placeholder="What happened?"
          className="w-full px-3 py-2 rounded-xl bg-secondary/60 border border-border focus:border-primary outline-none text-sm resize-none"
        />
        <p className="text-[10px] text-muted-foreground text-right mt-1">{reason.length}/500</p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={onCancel}
            className="flex-1 px-3 py-2 rounded-xl bg-secondary/60 border border-border text-sm font-display"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!reason.trim()}
            className="flex-1 px-3 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-display disabled:opacity-40"
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}
