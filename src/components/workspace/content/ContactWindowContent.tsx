import { MailSend01Icon } from '@hugeicons/core-free-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  CONTACT_EMAIL,
  CONTACT_FORM_ENDPOINT,
  CONTACT_LOCATION_LABEL,
  CONTACT_MAILTO_LINK,
  CONTACT_MAPS_LINK,
  CONTACT_PHONE_DISPLAY,
  CONTACT_WHATSAPP_LINK,
} from '../../../data/workspaceData';
import { Icon } from '../../ui/Icon';
import { ContactIcon } from './WorkspaceContentIcons';

const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Please enter at least 2 characters for your name.'),
  email: z.email('Please enter a valid email address.'),
  message: z
    .string()
    .trim()
    .min(10, 'Please share at least a short message (10+ characters).')
    .max(1000, 'Message is too long. Keep it under 1000 characters.'),
  company: z.string().trim().max(0).optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactWindowContent() {
  const [submitError, setSubmitError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const toastTimerRef = useRef<number | null>(null);
  const lastSubmitAtRef = useRef(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitError('');
    const now = Date.now();
    if (now - lastSubmitAtRef.current < 8000) {
      setSubmitError('Please wait a few seconds before sending another message.');
      return;
    }
    lastSubmitAtRef.current = now;

    if (values.company) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'omit',
        referrerPolicy: 'strict-origin-when-cross-origin',
        signal: controller.signal,
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          message: values.message,
          _subject: `Portfolio inquiry from ${values.name}`,
          _captcha: 'false',
          _template: 'table',
        }),
      });
      window.clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Request failed');
      }

      reset();
      setSuccessToast('Message sent successfully. I will get back to you soon.');

      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }

      toastTimerRef.current = window.setTimeout(() => {
        setSuccessToast('');
      }, 3600);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setSubmitError('Request timed out. Please try again.');
        return;
      }
      setSubmitError('Could not send message. Please use email card above to contact me directly.');
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  return (
    <section className="contact-window">
      <aside className="contact-side">
        <span className="contact-chip">Contact</span>
        <h4>Get in touch</h4>
        <p>Have a project in mind? Reach out and I will respond as soon as possible.</p>

        <div className="contact-cards">
          <a className="contact-card" href={CONTACT_MAILTO_LINK}>
            <i className="contact-card-icon" aria-hidden="true">
              <ContactIcon kind="email" />
            </i>
            <span className="contact-card-copy">
              <strong>Email me</strong>
              <small>{CONTACT_EMAIL}</small>
            </span>
            <i className="contact-card-arrow" aria-hidden="true">
              <ContactIcon kind="arrow" />
            </i>
          </a>

          <a
            className="contact-card"
            href={CONTACT_WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="contact-card-icon" aria-hidden="true">
              <ContactIcon kind="phone" />
            </i>
            <span className="contact-card-copy">
              <strong>WhatsApp</strong>
              <small>{CONTACT_PHONE_DISPLAY}</small>
            </span>
            <i className="contact-card-arrow" aria-hidden="true">
              <ContactIcon kind="arrow" />
            </i>
          </a>

          <a
            className="contact-card"
            href={CONTACT_MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="contact-card-icon" aria-hidden="true">
              <ContactIcon kind="location" />
            </i>
            <span className="contact-card-copy">
              <strong>Location</strong>
              <small>{CONTACT_LOCATION_LABEL}</small>
            </span>
            <i className="contact-card-arrow" aria-hidden="true">
              <ContactIcon kind="arrow" />
            </i>
          </a>
        </div>
      </aside>

      <form
        className="contact-form"
        onSubmit={handleSubmit(onSubmit)}
        aria-describedby={submitError ? 'contact-submit-error' : undefined}
        noValidate
      >
        <label className={`contact-field${errors.name ? ' has-error' : ''}`} htmlFor="contact-name">
          <span>Name</span>
          <input
            id="contact-name"
            type="text"
            placeholder="Your Name"
            autoComplete="name"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            {...register('name')}
          />
          {errors.name ? (
            <small id="contact-name-error" className="contact-field-error">
              {errors.name.message}
            </small>
          ) : null}
        </label>

        <label
          className={`contact-field${errors.email ? ' has-error' : ''}`}
          htmlFor="contact-email"
        >
          <span>Email</span>
          <input
            id="contact-email"
            type="email"
            placeholder="Your Email Address"
            autoComplete="email"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            {...register('email')}
          />
          {errors.email ? (
            <small id="contact-email-error" className="contact-field-error">
              {errors.email.message}
            </small>
          ) : null}
        </label>

        <label
          className={`contact-field${errors.message ? ' has-error' : ''}`}
          htmlFor="contact-message"
        >
          <span>Message</span>
          <textarea
            id="contact-message"
            placeholder="Tell me about your project..."
            rows={8}
            autoComplete="off"
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            {...register('message')}
          />
          {errors.message ? (
            <small id="contact-message-error" className="contact-field-error">
              {errors.message.message}
            </small>
          ) : null}
        </label>

        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="sr-only"
          {...register('company')}
        />

        <button
          type="submit"
          className={`contact-submit${isSubmitting ? ' is-loading' : ''}`}
          disabled={isSubmitting}
        >
          <Icon icon={MailSend01Icon} size={16} className="contact-submit-icon" />
          {isSubmitting ? 'Sending...' : 'Send message'}
        </button>

        {submitError ? (
          <p id="contact-submit-error" className="contact-submit-message is-error" role="alert">
            {submitError}
          </p>
        ) : null}

        {successToast ? (
          <div className="contact-success-toast" role="status" aria-live="polite">
            <Icon icon={MailSend01Icon} size={14} className="contact-success-toast-icon" />
            <span>{successToast}</span>
          </div>
        ) : null}
      </form>
    </section>
  );
}
