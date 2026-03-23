// lib/i18n/translations.ts — All UI text in EN and AR

export type Language = 'en' | 'ar';

const translations = {
    en: {
        // Navigation
        nav: {
            dashboard: 'Dashboard',
            conversations: 'Conversations',
            analytics: 'Analytics',
            settings: 'Settings',
            logs: 'System Logs',
            // Mobile nav
            home: 'Home',
            chat: 'Chat',
            stats: 'Stats',
            config: 'Config',
        },

        // Sidebar
        sidebar: {
            botDashboard: 'Bot Dashboard',
            botActive: 'Active',
            botInactive: 'Inactive',
            notConfigured: 'Not configured',
        },

        // TopBar
        topbar: {
            searchPlaceholder: 'Search conversations...',
            admin: 'Admin',
        },

        // Dashboard page
        dashboard: {
            title: 'Dashboard',
            subtitle: 'Overview of your MessengerAI bot performance',
            botStatus: 'Bot Status',
            online: 'Online & Responding',
            offline: 'Offline',
        },

        // Stats cards
        stats: {
            totalConversations: 'Total Conversations',
            messagesToday: 'Messages Today',
            activeUsers: 'Active Users',
            avgResponseTime: 'Avg Response Time',
            seconds: 's',
        },

        // Charts
        chart: {
            activityTitle: 'Message Activity',
            activitySubtitle: 'Messages per day (last 7 days)',
            messages: 'Messages',
            noData: 'No activity data available',
        },

        // Recent Conversations
        conversations: {
            recentTitle: 'Recent Conversations',
            recentSubtitle: 'Latest customer interactions',
            viewAll: 'View All',
            noConversations: 'No conversations yet',
            noConversationsDesc: 'Customer conversations will appear here once your bot starts receiving messages.',
            messagesCount: (n: number) => `${n} message${n !== 1 ? 's' : ''}`,
            loading: 'Loading...',
        },

        // Settings page
        settings: {
            title: 'Settings',
            subtitle: 'Configure your MessengerAI bot',
            save: 'Save Changes',
            saving: 'Saving...',
            saved: 'Settings saved successfully!',
            error: 'Failed to save settings',
        },

        // Analytics page
        analytics: {
            title: 'Analytics',
            subtitle: 'Insights into your bot performance',
        },

        // Logs page
        logsPage: {
            title: 'System Logs',
            subtitle: 'Real-time activity and error tracking',
        },

        // Conversations page
        conversationsPage: {
            title: 'Conversations',
            subtitle: 'All customer interactions',
        },

        // Common
        common: {
            loading: 'Loading...',
            error: 'An error occurred',
            retry: 'Retry',
            bot: 'Bot',
            active: 'Active',
            inactive: 'Inactive',
        },
    },

    ar: {
        // Navigation
        nav: {
            dashboard: 'لوحة التحكم',
            conversations: 'المحادثات',
            analytics: 'التحليلات',
            settings: 'الإعدادات',
            logs: 'سجل النظام',
            // Mobile nav
            home: 'الرئيسية',
            chat: 'المحادثات',
            stats: 'الإحصاء',
            config: 'الإعداد',
        },

        // Sidebar
        sidebar: {
            botDashboard: 'لوحة البوت',
            botActive: 'نشط',
            botInactive: 'متوقف',
            notConfigured: 'غير مُهيأ',
        },

        // TopBar
        topbar: {
            searchPlaceholder: 'ابحث في المحادثات...',
            admin: 'المشرف',
        },

        // Dashboard page
        dashboard: {
            title: 'لوحة التحكم',
            subtitle: 'نظرة عامة على أداء البوت',
            botStatus: 'حالة البوت',
            online: 'نشط ويرد',
            offline: 'متوقف',
        },

        // Stats cards
        stats: {
            totalConversations: 'إجمالي المحادثات',
            messagesToday: 'رسائل اليوم',
            activeUsers: 'المستخدمون النشطون',
            avgResponseTime: 'متوسط وقت الرد',
            seconds: 'ث',
        },

        // Charts
        chart: {
            activityTitle: 'نشاط الرسائل',
            activitySubtitle: 'الرسائل يومياً (آخر 7 أيام)',
            messages: 'رسائل',
            noData: 'لا توجد بيانات نشاط',
        },

        // Recent Conversations
        conversations: {
            recentTitle: 'المحادثات الأخيرة',
            recentSubtitle: 'أحدث تفاعلات العملاء',
            viewAll: 'عرض الكل',
            noConversations: 'لا توجد محادثات بعد',
            noConversationsDesc: 'ستظهر محادثات العملاء هنا بمجرد أن يبدأ البوت في استقبال الرسائل.',
            messagesCount: (n: number) => `${n} رسالة`,
            loading: 'جاري التحميل...',
        },

        // Settings page
        settings: {
            title: 'الإعدادات',
            subtitle: 'اضبط إعدادات بوت MessengerAI',
            save: 'حفظ التغييرات',
            saving: 'جاري الحفظ...',
            saved: 'تم حفظ الإعدادات بنجاح!',
            error: 'فشل في حفظ الإعدادات',
        },

        // Analytics page
        analytics: {
            title: 'التحليلات',
            subtitle: 'رؤى حول أداء البوت',
        },

        // Logs page
        logsPage: {
            title: 'سجل النظام',
            subtitle: 'تتبع النشاط والأخطاء في الوقت الفعلي',
        },

        // Conversations page
        conversationsPage: {
            title: 'المحادثات',
            subtitle: 'جميع تفاعلات العملاء',
        },

        // Common
        common: {
            loading: 'جاري التحميل...',
            error: 'حدث خطأ',
            retry: 'إعادة المحاولة',
            bot: 'البوت',
            active: 'نشط',
            inactive: 'متوقف',
        },
    },
};

export default translations;
export type Translations = typeof translations.en;
