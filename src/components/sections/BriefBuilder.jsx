import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { useSound } from "@/context/SoundContext";
import { contact, mailto, site } from "@/data/portfolioData";
import { getLang, t } from "@/i18n";
import { sendBrief } from "@/lib/contactForm";
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
   posts it to this site's own server (api/brief.js), which saves it and
   emails it to the inbox; the visitor never leaves the page and no mail
   app opens. */
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
      setError(t("brief.errors.emailMissing"));
      play("nope");
      emailRef.current?.focus();
      return;
    }
    if (needs.length === 0 && !message.trim()) {
      setError(t("brief.errors.empty"));
      play("nope");
      return;
    }
    setEmailInvalid(false);
    setError("");

    const brief = { name: name.trim(), email: email.trim(), needs, budget, timeline, message: message.trim(), botcheck, lang: getLang() };

    setStatus("sending");
    try {
      await sendBrief(brief);
      setStatus("sent");
      play("pop");
    } catch (err) {
      setStatus("failed");
      const known = ["invalid_email", "empty", "rate_limited", "network"];
      setError(known.includes(err.code) ? t(`brief.errors.${err.code}`) : t("brief.errors.generic"));
      play("nope");
    }
  };

  return (
    <Artboard id="brief" name={t("layer.brief")} file="brief.psd">
      <p className={cx("eyebrow", "mono")}>{t("brief.eyebrow")}</p>
      <RevealText className={cx("h-lg", styles.title)}>{t("brief.title")}</RevealText>

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
              <h3 className={styles.sentTitle}>{t("brief.sentTitle", { first: name.trim().split(" ")[0] })}</h3>
              <p className={styles.sentText}>
                {t("brief.sentBefore")} <strong dir="ltr">{email.trim()}</strong> {t("brief.sentAfter")}
              </p>
              <button type="button" className={styles.again} onClick={reset}>
                {t("brief.another")}
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
            <ChipGroup legend={t("brief.needs")} options={contact.needs} value={needs} onToggle={toggleNeed} multiple />
            <div className={styles.row}>
              <ChipGroup
                legend={t("brief.budget")}
                options={contact.budgets}
                value={budget}
                onToggle={(v) => {
                  setBudget(v === budget ? "" : v);
                  play("tick");
                }}
              />
              <ChipGroup
                legend={t("brief.when")}
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
                  {t("brief.name")}
                </label>
                <input
                  id={ids.name}
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder={t("brief.optional")}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor={ids.email} className={cx(styles.legend, "mono")}>
                  {t("brief.email")} <span className={styles.required}>{t("brief.required")}</span>
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
                  placeholder={t("brief.emailPlaceholder")}
                  dir="ltr"
                  required
                  aria-invalid={emailInvalid}
                  aria-describedby={ids.emailHint}
                />
                <span id={ids.emailHint} className={cx(styles.fieldHint, "mono")}>
                  {t("brief.emailHint")}
                </span>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor={ids.message} className={cx(styles.legend, "mono")}>
                {t("brief.message")}
              </label>
              <textarea
                id={ids.message}
                className={styles.input}
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("brief.messagePlaceholder")}
              />
            </div>

            {/* spam trap: hidden from people, filled in by bots */}
            <label className={styles.trap} aria-hidden="true">
              {t("common.leaveEmpty")}
              <input type="text" tabIndex={-1} autoComplete="off" value={botcheck} onChange={(e) => setBotcheck(e.target.value)} />
            </label>

            {error && (
              <p id={ids.error} className={styles.error} role="alert">
                {error}
                {status === "failed" && (
                  <>
                    {" "}
                    {t("brief.tryAgainOr")}{" "}
                    <a href={mailto(t("brief.subject"))} dir="ltr">
                      {site.email}
                    </a>
                    .
                  </>
                )}
              </p>
            )}

            <div className={styles.submit}>
              <Button type="submit" icon={status === "sending" ? null : "arrow"} disabled={status === "sending"} aria-busy={status === "sending"}>
                {status === "sending" ? (
                  <span className={styles.sending}>
                    <i className={styles.spinner} aria-hidden="true" />
                    {t("brief.sending")}
                  </span>
                ) : status === "failed" ? (
                  t("brief.tryAgain")
                ) : (
                  t("brief.send")
                )}
              </Button>
              <p className={cx(styles.hint, "mono")}>{t("brief.hint")}</p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Artboard>
  );
}
