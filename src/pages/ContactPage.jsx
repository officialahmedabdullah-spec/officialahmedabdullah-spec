import { useSound } from "@/context/SoundContext";
import { useToast } from "@/context/ToastContext";
import { contact } from "@/data/portfolioData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { t } from "@/i18n";
import { copyText, cx } from "@/lib/utils";
import BriefBuilder from "@/components/sections/BriefBuilder";
import ChatProcess from "@/components/sections/ChatProcess";
import PageHeader from "@/components/sections/PageHeader";
import { Icon } from "@/components/ui/Icon";
import styles from "./ContactPage.module.css";

export default function ContactPage() {
  useDocumentTitle(t("contactPage.title"));
  const toast = useToast();
  const { play } = useSound();

  const copy = async (value) => {
    const ok = await copyText(value);
    play("copy");
    toast(ok ? t("common.copied", { value }) : value);
  };

  return (
    <>
      <PageHeader file="contact.psd" eyebrow={t("contactPage.eyebrow")} title={t("contactPage.headline")} lede={contact.lead}>
        <ul className={styles.channels}>
          {contact.channels.map((channel) => (
            <li key={channel.key} className={styles.channel}>
              <span className={cx(styles.key, "mono")}>{channel.key}</span>
              {channel.href ? (
                <a
                  className={styles.value}
                  href={channel.href}
                  {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
                >
                  <span dir={channel.copy ? "ltr" : undefined}>{channel.value}</span>
                  <Icon name="arrowUpRight" size={16} />
                </a>
              ) : (
                <span className={styles.value}>{channel.value}</span>
              )}
              <span className={styles.note}>{channel.note}</span>
              {channel.copy && (
                <button type="button" className={styles.copy} onClick={() => copy(channel.copy)} aria-label={t("common.copyWhat", { what: channel.key })}>
                  <Icon name="copy" size={15} />
                </button>
              )}
            </li>
          ))}
        </ul>
      </PageHeader>
      <BriefBuilder />
      <ChatProcess />
    </>
  );
}
