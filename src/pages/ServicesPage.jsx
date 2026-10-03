import { Link } from "react-router";
import { services, servicesIntro, workProcess } from "@/data/portfolioData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { t } from "@/i18n";
import { cx } from "@/lib/utils";
import PageHeader from "@/components/sections/PageHeader";
import Pricing from "@/components/sections/Pricing";
import Steps from "@/components/sections/Steps";
import Artboard from "@/components/ui/Artboard";
import { Icon } from "@/components/ui/Icon";
import styles from "./ServicesPage.module.css";

export default function ServicesPage() {
  useDocumentTitle(t("servicesPage.title"));

  return (
    <>
      <PageHeader file="services.psd" eyebrow={t("servicesPage.eyebrow")} title={t("servicesPage.headline")} lede={servicesIntro.note} />

      <Artboard id="all-services" name={t("layer.allServices")} file="services-grid.psd">
        <ul className={styles.grid}>
          {services.map((service) => (
            <li key={service.slug}>
              <Link to={`/services/${service.slug}`} className={styles.cell} data-cursor="view" data-cursor-label={t("common.open")}>
                <span className={styles.top}>
                  <span className={styles.icon}>
                    <Icon name={service.icon} size={20} />
                  </span>
                  <span className={cx(styles.n, "mono")}>{service.number}</span>
                </span>
                <span className={styles.name}>
                  {service.title}
                  {service.isNew && <span className={cx(styles.new, "mono")}>{t("servicesPage.new")}</span>}
                </span>
                <span className={styles.short}>{service.short}</span>
                <span className={cx(styles.group, "mono")}>{service.group}</span>
                <span className={styles.arrow} aria-hidden="true">
                  <Icon name="arrowUpRight" size={18} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Artboard>

      <Pricing />
      <Steps title={t("servicesPage.stepsTitle")} steps={workProcess.steps} eyebrow={t("servicesPage.stepsEyebrow")} />
    </>
  );
}
