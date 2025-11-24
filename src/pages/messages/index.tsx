import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  MessageCircle,
  Users,
  Filter,
  MoreHorizontal,
  Star,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

// Hooks
import { useMessageApi } from "@/hooks/use-message-api";
import { useAuth } from "@/hooks/use-auth";

// Types
import type { Conversation } from "@/types/message";
import { useLanguage } from "@/hooks/use-language";

export default function MessagesPage() {
  const { t, dir,language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { useGetConversations, useGetUnreadCount } = useMessageApi();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data: conversationsData, isLoading, error } = useGetConversations();
  const { data: unreadCountData } = useGetUnreadCount();

  const conversations = useMemo(() => {
    return conversationsData?.data || [];
  }, [conversationsData]);
  const unreadCount = unreadCountData?.data || 0;

  // Filter conversations based on search and active tab
  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((conversation: Conversation) => {
        const receiverName =
          `${conversation.receiver.firstName} ${conversation.receiver.lastName}`.toLowerCase();
        const subject = conversation.subject.toLowerCase();
        const lastMessage =
          conversation.lastMessage?.content.toLowerCase() || "";

        return (
          receiverName.includes(query) ||
          subject.includes(query) ||
          lastMessage.includes(query)
        );
      });
    }

    // Tab filter
    switch (activeTab) {
      case "unread":
        return filtered.filter((conv: Conversation) => conv.unreadCount > 0);
      case "starred":
        // You can implement starring functionality later
        return filtered;
      case "archived":
        // You can implement archiving functionality later
        return filtered;
      default:
        return filtered;
    }
  }, [conversations, searchQuery, activeTab]);

  const handleNewMessage = () => {
    navigate("/messages/new");
  };

  const handleConversationClick = (conversation: Conversation) => {
    navigate(`/messages/conversation/${conversation.id}`);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return t("messages.time.minutesAgo", { count: diffMinutes });
    } else if (diffHours < 24) {
      return t("messages.time.hoursAgo", { count: diffHours });
    } else if (diffDays === 1) {
      return t("messages.time.yesterday");
    } else if (diffDays < 7) {
      return t("messages.time.daysAgo", { count: diffDays });
    } else {
      return date.toLocaleDateString(language);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      ABSENCE: "bg-red-100 text-red-800 border-red-200",
      ACADEMIC: "bg-blue-100 text-blue-800 border-blue-200",
      BEHAVIOR: "bg-amber-100 text-amber-800 border-amber-200",
      GENERAL: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      ABSENCE: t("messages.categories.absence"),
      ACADEMIC: t("messages.categories.academic"),
      BEHAVIOR: t("messages.categories.behavior"),
      GENERAL: t("messages.categories.general"),
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t("messages.error.title")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("messages.error.description")}
            </p>
            <Button onClick={() => window.location.reload()}>
              {t("messages.error.retry")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("messages.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {unreadCount > 0
                ? t("messages.subtitleWithUnread", { count: unreadCount })
                : t("messages.subtitle")}
            </p>
          </div>

          <Button
            onClick={handleNewMessage}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("messages.newMessage")}
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 shadow-sm border-0">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t("messages.search.placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 h-11"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-11">
                    <Filter className="w-4 h-4 mr-2" />
                    {t("messages.filter")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    {t("messages.filters.unread")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {t("messages.filters.starred")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {t("messages.filters.archived")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs dir={dir} value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 p-1 bg-muted/50 rounded-lg">
            <TabsTrigger value="all" className="rounded-md">
              {t("messages.tabs.all")}
            </TabsTrigger>
            <TabsTrigger value="unread" className="rounded-md">
              <div className="flex items-center gap-2">
                {t("messages.tabs.unread")}
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="h-5 px-1 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger value="starred" className="rounded-md">
              {t("messages.tabs.starred")}
            </TabsTrigger>
            <TabsTrigger value="archived" className="rounded-md">
              {t("messages.tabs.archived")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Conversations List */}
        <Card className="shadow-sm border-0">
          <CardContent className="p-0">
            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="p-4 border-b border-border">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                </div>
              ))
            ) : filteredConversations.length === 0 ? (
              // Empty State
              <div className="text-center py-12">
                <MessageCircle className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchQuery || activeTab !== "all"
                    ? t("messages.empty.filtered.title")
                    : t("messages.empty.title")}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {searchQuery || activeTab !== "all"
                    ? t("messages.empty.filtered.description")
                    : t("messages.empty.description")}
                </p>
                {!searchQuery && activeTab === "all" && (
                  <Button onClick={handleNewMessage}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t("messages.newMessage")}
                  </Button>
                )}
              </div>
            ) : (
              // Conversations List
              filteredConversations.map((conversation: Conversation) => {
                const otherParticipant =
                  conversation.initiator.id === user?.id
                    ? conversation.receiver
                    : conversation.initiator;

                const hasUnread = conversation.unreadCount > 0;

                return (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b border-border transition-all duration-200 hover:bg-muted/50 cursor-pointer group ${
                      hasUnread ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                    }`}
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <Avatar className="h-12 w-12 border-2 border-background">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {getInitials(
                              otherParticipant.firstName,
                              otherParticipant.lastName
                            )}
                          </AvatarFallback>
                        </Avatar>
                        {hasUnread && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-background" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`font-semibold truncate ${
                                hasUnread
                                  ? "text-blue-600 dark:text-blue-400"
                                  : ""
                              }`}
                            >
                              {otherParticipant.firstName}{" "}
                              {otherParticipant.lastName}
                            </h4>
                            <Badge
                              variant="secondary"
                              className={`text-xs border ${getCategoryColor(
                                conversation.category
                              )}`}
                            >
                              {getCategoryLabel(conversation.category)}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs ${
                                hasUnread
                                  ? "text-blue-600 font-medium"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {formatTime(conversation.lastMessageAt)}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Star className="h-4 w-4 mr-2" />
                                  {t("messages.actions.star")}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Archive className="h-4 w-4 mr-2" />
                                  {t("messages.actions.archive")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <h5 className="font-medium text-foreground mb-1 truncate">
                          {conversation.subject}
                        </h5>

                        <p
                          className={`text-sm mb-2 line-clamp-2 ${
                            hasUnread
                              ? "text-foreground font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {conversation.lastMessage?.content ||
                            t("messages.noMessages")}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {conversation.student && (
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>{conversation.student.name}</span>
                                <span className="text-muted-foreground/70">
                                  • {t("messages.grade")}{" "}
                                  {conversation.student.grade}
                                </span>
                              </div>
                            )}
                          </div>

                          {hasUnread && (
                            <Badge
                              variant="default"
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
