'use client';

import { useState, useEffect } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { courses as localCourses } from '@/lib/courses';
import type { Course } from '@/lib/courses';
import { supabase } from '@/lib/supabase';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>(localCourses);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    fetch('/api/courses')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.length > 0) setCourses(data);
      })
      .catch(() => {});
  }, []);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again or reach us on WhatsApp.');
      return;
    }
    setStatus('loading');
    setErrorMessage(null);

    const { error } = await supabase.from('contact_enquiries').insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
      status: 'new',
    });

    if (error) {
      setStatus('error');
      setErrorMessage("We couldn't send your message. Please try again, or message us on WhatsApp.");
      return;
    }

    setStatus('success');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-8 shadow-premium">
      <h2 className="font-display text-2xl font-bold text-foreground">Send a Message</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Fill out the form below and we&apos;ll get back to you as soon as possible.
      </p>

      {status === 'success' && (
        <div className="mt-6 flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 p-4">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <p className="text-sm font-medium text-green-800">
            Thank you! Your message has been received. We&apos;ll be in touch soon.
          </p>
        </div>
      )}

      {status === 'error' && errorMessage && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Your name"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="you@example.com"
              className="h-11"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+92 3XX XXXXXXX"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject of Interest</Label>
            <Select onValueChange={(v) => handleChange('subject', v)}>
              <SelectTrigger id="subject" className="h-11">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.slug} value={course.name}>
                    {course.name}
                  </SelectItem>
                ))}
                <SelectItem value="general">General Inquiry</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            required
            value={form.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder="Tell us about your goals, current level, and any questions you have."
            className="min-h-[120px] resize-y"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Prefer WhatsApp? Message us at{' '}
            <a
              href={`https://wa.me/923162165779`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ocean hover:underline"
            >
              +92 316 216 5779
            </a>
          </p>
          <Button
            type="submit"
            disabled={status === 'loading'}
            className="h-11 bg-ocean text-white shadow-glow hover:bg-ocean-dark"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <Send className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
