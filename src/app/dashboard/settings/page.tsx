// app/dashboard/settings/page.tsx — Settings page with 3 tabs: Business, Personality, Facebook

'use client';

import { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import appConfig from '@/config/app.config';
import { buildPrompt } from '@/lib/gemini/buildPrompt';
import type { BotSettings, Service } from '@/types';
import {
    Building2, Bot, Facebook, Plus, Trash2, Save, Copy, CheckCircle2,
    Globe, Phone, Clock, MapPin, MessageCircle, Sparkles, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const { settings, settingsLoading, updateSettings } = useSettings();
    const [formData, setFormData] = useState<Partial<BotSettings>>({});
    const [services, setServices] = useState<Service[]>([]);
    const [showPromptPreview, setShowPromptPreview] = useState(false);

    // Initialize form data when settings load
    useEffect(() => {
        if (settings) {
            setFormData(settings);
            setServices(settings.services || []);
        }
    }, [settings]);

    const handleSave = async (tab: string) => {
        if (tab === 'business') {
            await updateSettings({
                business_name: formData.business_name,
                business_description: formData.business_description,
                services: services,
                working_hours: formData.working_hours,
                address: formData.address,
                phone: formData.phone,
                whatsapp: formData.whatsapp,
            });
        } else if (tab === 'personality') {
            await updateSettings({
                dialect: formData.dialect,
                tone: formData.tone,
                custom_rules: formData.custom_rules,
                ai_model: formData.ai_model,
                max_tokens: formData.max_tokens,
                use_bytez: formData.use_bytez ?? true,
            });
        } else if (tab === 'facebook') {
            await updateSettings({
                page_access_token: formData.page_access_token,
                verify_token: formData.verify_token,
                is_active: formData.is_active,
            });
        }
    };

    const addService = () => {
        setServices([...services, { name: '', price: '', description: '' }]);
    };

    const removeService = (index: number) => {
        setServices(services.filter((_, i) => i !== index));
    };

    const updateService = (index: number, field: keyof Service, value: string) => {
        const updated = [...services];
        updated[index] = { ...updated[index], [field]: value };
        setServices(updated);
    };

    const copyWebhookUrl = () => {
        const url = `${process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app'}/api/webhook`;
        navigator.clipboard.writeText(url);
        toast.success('Webhook URL copied!');
    };

    // Generate live prompt preview
    const promptPreview = formData.business_name
        ? buildPrompt({
            ...settings!,
            ...formData,
            services,
        } as BotSettings)
        : '';

    if (settingsLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-[600px] w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-sm text-slate-400 mt-1">Configure your bot's behavior, business info, and connections</p>
            </div>

            <Tabs defaultValue="business" className="space-y-4">
                <TabsList className="bg-slate-800/50 border border-slate-700/50">
                    <TabsTrigger value="business" className="gap-2 data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">
                        <Building2 className="w-4 h-4" /> Business Info
                    </TabsTrigger>
                    <TabsTrigger value="personality" className="gap-2 data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">
                        <Bot className="w-4 h-4" /> Bot Personality
                    </TabsTrigger>
                    <TabsTrigger value="facebook" className="gap-2 data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">
                        <Facebook className="w-4 h-4" /> Facebook Config
                    </TabsTrigger>
                </TabsList>

                {/* Tab 1: Business Info */}
                <TabsContent value="business">
                    <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="text-lg text-white">Business Information</CardTitle>
                            <CardDescription>Details about your business that the bot will use in conversations</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Business Name & Description */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300"><Building2 className="w-3.5 h-3.5 inline mr-1" /> Business Name</Label>
                                    <Input
                                        value={formData.business_name || ''}
                                        onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                                        placeholder="اسم العمل"
                                        className="bg-slate-900/50 border-slate-700/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300"><Phone className="w-3.5 h-3.5 inline mr-1" /> Phone</Label>
                                    <Input
                                        value={formData.phone || ''}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="رقم الهاتف"
                                        className="bg-slate-900/50 border-slate-700/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-300">Business Description</Label>
                                <Textarea
                                    value={formData.business_description || ''}
                                    onChange={(e) => setFormData({ ...formData, business_description: e.target.value })}
                                    placeholder="وصف مختصر عن العمل..."
                                    className="bg-slate-900/50 border-slate-700/50 min-h-[100px]"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300"><Clock className="w-3.5 h-3.5 inline mr-1" /> Working Hours</Label>
                                    <Input
                                        value={formData.working_hours || ''}
                                        onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
                                        placeholder="9 AM - 5 PM"
                                        className="bg-slate-900/50 border-slate-700/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300"><MapPin className="w-3.5 h-3.5 inline mr-1" /> Address</Label>
                                    <Input
                                        value={formData.address || ''}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="العنوان"
                                        className="bg-slate-900/50 border-slate-700/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300"><MessageCircle className="w-3.5 h-3.5 inline mr-1" /> WhatsApp</Label>
                                    <Input
                                        value={formData.whatsapp || ''}
                                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                        placeholder="رقم الواتساب"
                                        className="bg-slate-900/50 border-slate-700/50"
                                    />
                                </div>
                            </div>

                            <Separator className="bg-slate-700/50" />

                            {/* Services */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-slate-300">Services & Prices</Label>
                                    <Button variant="outline" size="sm" onClick={addService} className="gap-1 text-xs border-slate-700 hover:bg-slate-700">
                                        <Plus className="w-3 h-3" /> Add Service
                                    </Button>
                                </div>
                                {services.map((service, idx) => (
                                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                                        <Input
                                            value={service.name}
                                            onChange={(e) => updateService(idx, 'name', e.target.value)}
                                            placeholder="Service Name"
                                            className="col-span-4 bg-slate-900/50 border-slate-700/50 text-sm"
                                        />
                                        <Input
                                            value={service.price}
                                            onChange={(e) => updateService(idx, 'price', e.target.value)}
                                            placeholder="Price"
                                            className="col-span-3 bg-slate-900/50 border-slate-700/50 text-sm"
                                        />
                                        <Input
                                            value={service.description}
                                            onChange={(e) => updateService(idx, 'description', e.target.value)}
                                            placeholder="Description"
                                            className="col-span-4 bg-slate-900/50 border-slate-700/50 text-sm"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeService(idx)}
                                            className="col-span-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <Button onClick={() => handleSave('business')} className="gap-2 bg-indigo-600 hover:bg-indigo-500">
                                <Save className="w-4 h-4" /> Save Business Info
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 2: Bot Personality */}
                <TabsContent value="personality">
                    <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="text-lg text-white">Bot Personality</CardTitle>
                            <CardDescription>Customize how the bot communicates with your customers</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300"><Globe className="w-3.5 h-3.5 inline mr-1" /> Dialect</Label>
                                    <Select
                                        value={formData.dialect || 'iraqi'}
                                        onValueChange={(value) => setFormData({ ...formData, dialect: value as any })}
                                    >
                                        <SelectTrigger className="bg-slate-900/50 border-slate-700/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            {appConfig.dialects.map((d) => (
                                                <SelectItem key={d.id} value={d.id}>{d.name} ({d.nameEn})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300"><Sparkles className="w-3.5 h-3.5 inline mr-1" /> Tone</Label>
                                    <Select
                                        value={formData.tone || 'friendly'}
                                        onValueChange={(value) => setFormData({ ...formData, tone: value as any })}
                                    >
                                        <SelectTrigger className="bg-slate-900/50 border-slate-700/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            {appConfig.tones.map((t) => (
                                                <SelectItem key={t.id} value={t.id}>{t.name} ({t.nameEn})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">AI Model</Label>
                                    <Select
                                        value={formData.ai_model || 'gemini-2.0-flash'}
                                        onValueChange={(value) => setFormData({ ...formData, ai_model: value })}
                                    >
                                        <SelectTrigger className="bg-slate-900/50 border-slate-700/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            {appConfig.models.map((m) => (
                                                <SelectItem key={m.id} value={m.id}>
                                                    {m.name} — {m.description}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">
                                        Max Tokens: <span className="text-indigo-400 font-mono">{formData.max_tokens || 400}</span>
                                    </Label>
                                    <input
                                        type="range"
                                        min="100"
                                        max="1000"
                                        step="50"
                                        value={formData.max_tokens || 400}
                                        onChange={(e) => setFormData({ ...formData, max_tokens: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-600">
                                        <span>100</span>
                                        <span>1000</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-300">Custom Rules</Label>
                                <Textarea
                                    value={formData.custom_rules || ''}
                                    onChange={(e) => setFormData({ ...formData, custom_rules: e.target.value })}
                                    placeholder="تعليمات إضافية للبوت... (مثال: لا ترد على أسئلة المنافسين)"
                                    className="bg-slate-900/50 border-slate-700/50 min-h-[100px]"
                                />
                            </div>

                            {/* Live Prompt Preview */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-slate-300">
                                        <Eye className="w-3.5 h-3.5 inline mr-1" /> System Prompt Preview
                                    </Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowPromptPreview(!showPromptPreview)}
                                        className="text-xs text-indigo-400 hover:text-indigo-300"
                                    >
                                        {showPromptPreview ? 'Hide' : 'Show'} Preview
                                    </Button>
                                </div>
                                {showPromptPreview && (
                                    <div className="bg-slate-900/80 rounded-lg p-4 border border-slate-700/50 max-h-[300px] overflow-y-auto">
                                        <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed" dir="rtl">
                                            {promptPreview}
                                        </pre>
                                    </div>
                                )}
                            </div>

                            {/* AI Provider Toggle */}
                            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.use_bytez !== false ? 'bg-violet-500/20 text-violet-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            Primary AI: {formData.use_bytez !== false ? 'Bytez (Gemma 4)' : 'Groq (Llama 3.3)'}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {formData.use_bytez !== false
                                                ? 'Gemma 4 is active — Groq is on standby'
                                                : 'Groq only — Bytez is disabled'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">
                                        {formData.use_bytez !== false ? 'ON' : 'OFF'}
                                    </span>
                                    <Switch
                                        checked={formData.use_bytez !== false}
                                        onCheckedChange={(checked: boolean) =>
                                            setFormData({ ...formData, use_bytez: checked })
                                        }
                                    />
                                </div>
                            </div>

                            <Button onClick={() => handleSave('personality')} className="gap-2 bg-indigo-600 hover:bg-indigo-500">
                                <Save className="w-4 h-4" /> Save Personality
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 3: Facebook Config */}
                <TabsContent value="facebook">
                    <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="text-lg text-white">Facebook Configuration</CardTitle>
                            <CardDescription>Connect your Facebook Page and configure the webhook</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Page Access Token</Label>
                                <Input
                                    type="password"
                                    value={formData.page_access_token || ''}
                                    onChange={(e) => setFormData({ ...formData, page_access_token: e.target.value })}
                                    placeholder="EAAxxxxxxxxx..."
                                    className="bg-slate-900/50 border-slate-700/50 font-mono text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-300">Verify Token</Label>
                                <Input
                                    value={formData.verify_token || ''}
                                    onChange={(e) => setFormData({ ...formData, verify_token: e.target.value })}
                                    placeholder="Your custom verify token"
                                    className="bg-slate-900/50 border-slate-700/50 font-mono text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-300">Webhook URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        readOnly
                                        value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app'}/api/webhook`}
                                        className="bg-slate-900/50 border-slate-700/50 font-mono text-sm text-slate-400"
                                    />
                                    <Button variant="outline" size="icon" onClick={copyWebhookUrl} className="border-slate-700 hover:bg-slate-700 shrink-0">
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-[10px] text-slate-600">
                                    Use this URL in your Facebook App's Webhook configuration
                                </p>
                            </div>

                            <Separator className="bg-slate-700/50" />

                            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-500'
                                        }`}>
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Bot Active</p>
                                        <p className="text-xs text-slate-500">
                                            {formData.is_active ? 'Bot is responding to messages' : 'Bot is paused'}
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    checked={formData.is_active || false}
                                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, is_active: checked })}
                                />
                            </div>

                            <Button onClick={() => handleSave('facebook')} className="gap-2 bg-indigo-600 hover:bg-indigo-500">
                                <Save className="w-4 h-4" /> Save Facebook Config
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
