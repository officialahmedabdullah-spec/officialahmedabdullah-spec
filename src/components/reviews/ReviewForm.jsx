import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { useSound } from "@/context/SoundContext";
import { caseStudies, services } from "@/data/portfolioData";
import { t } from "@/i18n";
import { submitReview } from "@/lib/reviews";
import { cx } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import StarInput from "./StarInput";
import styles from "./Reviews.module.css";

const MAX = 1200;

/* The review form. Every review is stored unapproved and only appears
   on the site after it's approved (see supabase/reviews.sql). */
export default function ReviewForm({ initialService = "", initialProject = "", onDone }) {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [service, setService] = useState(initialService);
  const [project, setProject] = useState(initialProject);
  const [body, setBody] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState("idle"); // idle · sending · sent · failed
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const { play } = useSound();
  const fileRef = useRef(null);
  const id = useId();

  // keep the photo preview URL tidy
  useEffect(() => {
    if (!photo) {
      setPreview("");
      return undefined;
    }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const pickPhoto = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((e) => ({ ...e, photo: t("reviews.form.errors.photoType") }));
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrors((e) => ({ ...e, photo: t("reviews.form.errors.photoSize") }));
      return;
    }
    setErrors(({ photo: _, ...rest }) => rest);
    setPhoto(file);
  };

  const validate = () => {
    const next = {};
    if (!rating) next.rating = t("reviews.form.errors.rating");
    if (name.trim().length < 2) next.name = t("reviews.form.errors.name");
    if (body.trim().length < 10) next.body = t("reviews.form.errors.body");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;
    if (trap) {
      // a bot filled the hidden field: pretend it worked, store nothing
      setStatus("sent");
      return;
    }
    if (!validate()) {
      play("nope");
      return;
    }
    setStatus("sending");
    setFormError("");
    try {
      await submitReview({ name, role, service, project, rating, body, photo });
      setStatus("sent");
      play("pop");
    } catch {
      setStatus("failed");
      setFormError(t("reviews.form.errors.failed"));
      play("nope");
    }
  };

  if (status === "sent") {
    return (
      <motion.div className={styles.thanks} role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <motion.span
          className={styles.thanksTick}
          initial={{ scale: 0, rotate: -40 }}
          animate={{ scale: 1, rotate: 0, transition: { type: "spring", stiffness: 380, damping: 14, delay: 0.1 } }}
          aria-hidden="true"
        >
          <Icon name="check" size={28} strokeWidth={2.4} />
        </motion.span>
        <h3>{t("reviews.form.thanks", { first: name.trim().split(" ")[0] })}</h3>
        <p>{t("reviews.form.thanksText")}</p>
        {onDone && (
          <button type="button" className={styles.linkButton} onClick={onDone}>
            {t("common.close")}
          </button>
        )}
      </motion.div>
    );
  }

  // an error disappears as soon as the field is fixed, not on the next submit
  const clearError = (key) => errors[key] && setErrors(({ [key]: _, ...rest }) => rest);

  const field = (key) => (errors[key] ? { "aria-invalid": true, "aria-describedby": `${id}-${key}` } : {});
  const errorText = (key) =>
    errors[key] && (
      <span id={`${id}-${key}`} className={styles.fieldError}>
        {errors[key]}
      </span>
    );

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.field}>
        <span className={cx(styles.label, "mono")}>{t("reviews.form.howWas")}</span>
        <StarInput value={rating} onChange={(n) => { setRating(n); play("tick", 0.8 + n * 0.1); setErrors(({ rating: _, ...rest }) => rest); }} invalid={Boolean(errors.rating)} />
        {errorText("rating")}
      </div>

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label className={cx(styles.label, "mono")} htmlFor={`${id}-name`}>
            {t("reviews.form.name")}
          </label>
          <input id={`${id}-name`} className={styles.input} value={name} onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim().length >= 2) clearError("name");
            }} autoComplete="name" maxLength={80} {...field("name")} />
          {errorText("name")}
        </div>
        <div className={styles.field}>
          <label className={cx(styles.label, "mono")} htmlFor={`${id}-role`}>
            {t("reviews.form.role")}
          </label>
          <input id={`${id}-role`} className={styles.input} value={role} onChange={(e) => setRole(e.target.value)} autoComplete="organization-title" placeholder={t("reviews.form.rolePlaceholder")} maxLength={100} />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label className={cx(styles.label, "mono")} htmlFor={`${id}-service`}>
            {t("reviews.form.service")}
          </label>
          <select id={`${id}-service`} className={styles.input} value={service} onChange={(e) => setService(e.target.value)}>
            <option value="">{t("reviews.form.serviceNone")}</option>
            {services.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={cx(styles.label, "mono")} htmlFor={`${id}-project`}>
            {t("reviews.form.project")}
          </label>
          <select id={`${id}-project`} className={styles.input} value={project} onChange={(e) => setProject(e.target.value)}>
            <option value="">{t("reviews.form.projectNone")}</option>
            {caseStudies.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.client}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={cx(styles.label, "mono")} htmlFor={`${id}-body`}>
          {t("reviews.form.body")}
        </label>
        <textarea
          id={`${id}-body`}
          className={styles.input}
          rows={5}
          value={body}
          onChange={(e) => {
            setBody(e.target.value.slice(0, MAX));
            if (e.target.value.trim().length >= 10) clearError("body");
          }}
          placeholder={t("reviews.form.bodyPlaceholder")}
          dir="auto"
          {...field("body")}
        />
        <span className={cx(styles.counter, "mono")} aria-live="polite">
          {body.length}/{MAX}
        </span>
        {errorText("body")}
      </div>

      <div className={styles.field}>
        <span className={cx(styles.label, "mono")}>{t("reviews.form.photo")}</span>
        <div className={styles.photoRow}>
          <span className={styles.photoPreview} aria-hidden="true">
            {preview ? <img src={preview} alt="" /> : <Icon name="camera" size={22} />}
          </span>
          <input ref={fileRef} type="file" accept="image/*" className="sr-only" id={`${id}-photo`} onChange={(e) => pickPhoto(e.target.files?.[0])} />
          <label htmlFor={`${id}-photo`} className={styles.photoButton}>
            {photo ? t("reviews.form.changePhoto") : t("reviews.form.addPhoto")}
          </label>
          {photo && (
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => {
                setPhoto(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
            >
              {t("reviews.form.remove")}
            </button>
          )}
        </div>
        {errorText("photo")}
      </div>

      {/* spam trap: hidden from people, filled in by bots */}
      <label className={styles.trap} aria-hidden="true">
        {t("common.leaveEmpty")}
        <input type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </label>

      <AnimatePresence>
        {formError && (
          <motion.p className={styles.formError} role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {formError}
          </motion.p>
        )}
      </AnimatePresence>

      <div className={styles.submitRow}>
        <Button type="submit" icon={status === "sending" ? null : "arrow"} disabled={status === "sending"} aria-busy={status === "sending"}>
          {status === "sending" ? t("brief.sending") : status === "failed" ? t("brief.tryAgain") : t("reviews.form.post")}
        </Button>
        <p className={cx(styles.small, "mono")}>{t("reviews.form.small")}</p>
      </div>
    </form>
  );
}
