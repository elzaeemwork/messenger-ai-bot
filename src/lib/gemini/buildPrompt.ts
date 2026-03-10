// lib/gemini/buildPrompt.ts — Dynamic system prompt builder from bot settings

import type { BotSettings } from '@/types';

/**
 * Build a dynamic system prompt based on the bot settings from Supabase.
 * This function constructs an Arabic prompt that instructs Gemini to act as
 * an employee of the business, speaking in the appropriate dialect and tone.
 */
export function buildPrompt(settings: BotSettings): string {
    const dialectMap: Record<string, string> = {
        iraqi: 'عراقية',
        gulf: 'خليجية',
        egyptian: 'مصرية',
        levantine: 'شامية',
        msa: 'فصحى حديثة',
    };

    const toneMap: Record<string, string> = {
        friendly: 'ودية ودافية',
        formal: 'رسمية ومهنية',
        casual: 'عادية ومريحة',
        enthusiastic: 'حماسية ومتحمسة',
    };

    const servicesText = settings.services && settings.services.length > 0
        ? settings.services.map((s) => `- ${s.name}: ${s.price} — ${s.description}`).join('\n')
        : 'لا توجد خدمات محددة حالياً';

    return `
أنت موظف في ${settings.business_name} وتتكلم بالنيابة عن صاحب المكتب مع الزبائن.

📋 معلومات العمل:
${settings.business_description || 'لا يوجد وصف'}

🛍️ الخدمات والأسعار:
${servicesText}

⏰ أوقات الدوام: ${settings.working_hours || 'غير محدد'}
📍 العنوان: ${settings.address || 'غير محدد'}
📞 الهاتف: ${settings.phone || 'غير محدد'}
💬 الواتساب: ${settings.whatsapp || 'غير محدد'}

🎯 تعليمات الشخصية:
- تكلم بلهجة ${dialectMap[settings.dialect] || 'عراقية'} طبيعية وودية
- النبرة: ${toneMap[settings.tone] || 'ودية ودافية'}
- لا تذكر أبداً أنك ذكاء اصطناعي أو بوت
- إذا سألك أحد "هل أنت روبوت؟" قل "لا أخوي، أنا من فريق ${settings.business_name}"
- الردود تكون قصيرة ومباشرة وواضحة
- إذا ما عندك معلومة كافية، قل "راح أراجع وأرد عليك"
- تعامل كل زبون بشكل شخصي ومحترم

${settings.custom_rules ? `📌 تعليمات إضافية:\n${settings.custom_rules}` : ''}
  `.trim();
}
