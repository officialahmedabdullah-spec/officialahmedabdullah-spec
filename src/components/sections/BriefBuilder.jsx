import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { useSound } from "@/context/SoundContext";
import { contact, mailto, site } from "@/data/portfolioData";
import { formConfigured, sendBrief } from "@/lib/contactForm";
import { cx } from "@/lib/utils";
import Artboard from "@/components/ui/Artboard";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import RevealText from "@/components/ui/RevealText";
import styles from "./BriefBuilder.module.css";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ease = [0.16, 1, 0.3, 1];

function ChipGroup({ legend, options, value, onToggle, multiple }) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={cx(styles.legend, "mono")}>{legend}</legend>
      <div className={styles.chips}>
        {options.map((option) => {
          const on = multiple ? value.includes(option) : value === option;
          return (
            <button key={option} type="button" className={styles.chip} aria-pressed={on} onClick={() => onToggle(option)}>
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/* brief.psd — tap through a short brief instead of a long form. "Send"
   delivers it straight to the inbox (see src/lib/contactForm.js); the
   visitor never leaves the page. */
export default function BriefBuilder() {
  const [needs, setNeeds] = useState([]);
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [botcheck, setBotcheck] = useState("");
  const [status, setStatus] = useState("idle"); // idle · sending · sent · failed
  const [error, setError] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const emailRef = useRef(null);
  const { play } = useSound();
  const ids = { name: useId(), email: useId(), message: useId(), error: useId(), emailHint: useId() };

  const toggleNeed = (need) => {
    setNeeds((list) => (list.includes(need) ? list.filter((item) => item !== need) : [...list, need]));
    play("tick");
  };

  const reset = () => {
    setNeeds([]);
    setBudget("");
    setTimeline("");
    setMessage("");
    setStatus("idle");
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;

    if (!EMAIL.test(email.trim())) {
      setEmailInvalid(true);
      setError("Add your email so I can reply to you.");
      play("nope");
      emailRef.current?.focus();
      return;
    }
    if (needs.length === 0 && !message.trim()) {
      setError("Pick at least one thing you need, or write a line about the project.");
      play("nope");
      return;
    }
    setEmailInvalid(false);
    setError("");

    const brief = { name: name.trim(), email: email.trim(), needs, budget, timeline, message: message.trim(), botcheck };

    // no key configured yet: fall back to the visitor's mail app
    if (!formConfigured) {
      const body = [
        brief.name && `Hi Ahmad, I'm ${brief.name}.`,
        needs.length && `I need: ${needs.join(", ")}.`,
        budget && `Budget: ${budget}.`,
        timeline && `Timeline: ${timeline}.`,
        brief.message && `\n${brief.message}`,
        `\nReply to: ${brief.email}`,
      ]
        .filter(Boolean)
        .join("\n");
      window.location.href = mailto(`Project brief${needs.length ? ` — ${needs[0]}` : ""}`, body);
      return;
    }

    setStatus("sending");
    try {
      await sendBrief(brief);
      setStatus("sent");
      play("pop");
    } catch (err) {
      setStatus("failed");
      setError(err.message || "Something went wrong.");
      play("nope");
    }
  };

  return (
    <Artboard id="brief" name="Brief" file="brief.psd">
      <p className={cx("eyebrow", "mono")}>Start here · 30 seconds</p>
      <RevealText className={cx("h-lg", styles.title)}>Build your brief in a few taps.</RevealText>

      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            className={styles.sent}
            role="status"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease } }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
          >
            <motion.span
              className={styles.tick}
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0, transition: { type: "spring", stiffness: 380, damping: 14, delay: 0.15 } }}
              aria-hidden="true"
            >
              <Icon name="check" size={30} strokeWidth={2.4} />
            </motion.span>
            <div>
              <h3 className={styles.sentTitle}>Brief received. Thank you{name.trim() ? `, ${name.trim().split(" ")[0]}` : ""}!</h3>
              <p className={styles.sentText}>
                It's in my inbox now. I'll reply to <strong>{email.trim()}</strong> — usually within a day.
              </p>
              <button type="button" className={styles.again} onClick={reset}>
                Send another brief
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className={styles.form}
            onSubmit={submit}
            noValidate
            aria-describedby={error ? ids.error : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4 } }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
          >
            <ChipGroup legend="What do you need?" options={contact.needs} value={needs} onToggle={toggleNeed} multiple />
            <div className={styles.row}>
              <ChipGroup
                legend="Budget"
                options={contact.budgets}
                value={budget}
                onToggle={(v) => {
                  setBudget(v === budget ? "" : v);
                  play("tick");
                }}
              />
              <ChipGroup
                legend="When"
                options={contact.timelines}
                value={timeline}
                onToggle={(v) => {
                  setTimeline(v === timeline ? "" : v);
                  play("tick");
                }}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor={ids.name} className={cx(styles.legend, "mono")}>
                  Your name
                </label>
                <input
                  id={ids.name}
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="Optional"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor={ids.email} className={cx(styles.legend, "mono")}>
                  Your email <span className={styles.required}>· required</span>
                </label>
                <input
                  ref={emailRef}
                  id={ids.email}
                  type="email"
                  inputMode="email"
                  className={cx(styles.input, emailInvalid && styles.invalid)}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailInvalid && EMAIL.test(e.target.value.trim())) setEmailInvalid(false);
                  }}
                  autoComplete="email"
                  placeholder="you@company.com"
                  required
                  aria-invalid={emailInvalid}
                  aria-describedby={ids.emailHint}
                />
                <span id={ids.emailHint} className={cx(styles.fieldHint, "mono")}>
                  So I can reply — never shared
                </span>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor={ids.message} className={cx(styles.legend, "mono")}>
                Anything else?
              </label>
              <textarea
                id={ids.message}
                className={styles.input}
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Brand, audience, deadline, links…"
              />
            </div>

            {/* spam trap: hidden from people, filled in by bots */}
            <label className={styles.trap} aria-hidden="true">
              Leave this empty
              <input type="text" tabIndex={-1} autoComplete="off" value={botcheck} onChange={(e) => setBotcheck(e.target.value)} />
            </label>

            {error && (
              <p id={ids.error} className={styles.error} role="alert">
                {error}
                {status === "failed" && (
                  <>
                    {" "}
                    Try again, or email me at <a href={mailto("Project brief")}>{site.email}</a>.
                  </>
                )}
              </p>
            )}

            <div className={styles.submit}>
              <Button type="submit" icon={status === "sending" ? null : "arrow"} disabled={status === "sending"} aria-busy={status === "sending"}>
                {status === "sending" ? (
                  <span className={styles.sending}>
                    <i className={styles.spinner} aria-hidden="true" />
                    Sending…
                  </span>
                ) : status === "failed" ? (
                  "Try again"
                ) : (
                  "Send brief"
                )}
              </Button>
              <p className={cx(styles.hint, "mono")}>
                {formConfigured ? "Goes straight to my inbox · I reply within a day" : "Opens your mail app · nothing is stored here"}
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Artboard>
  );
}
