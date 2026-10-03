import { Link } from "react-router";
import { services, servicesIntro, workProcess } from "@/data/portfolioData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { cx } from "@/lib/utils";
import PageHeader from "@/components/sections/PageHeader";
import Pricing from "@/components/sections/Pricing";
import Steps from "@/components/sections/Steps";
import Artboard from "@/components/ui/Artboard";
import { Icon } from "@/components/ui/Icon";
import styles from "./ServicesPage.module.css";

export default function ServicesPage() {
  useDocumentTitle("Services");

  return (
    <>
      <PageHeader file="services.psd" eyebrow="Services" title="Ten ways to get noticed." lede={servicesIntro.note} />

      <Artboard id="all-services" name="All services" file="services-grid.psd">
        <ul className={styles.grid}>
          {services.map((service) => (
            <li key={service.slug}>
              <Link to={`/services/${service.slug}`} className={styles.cell} data-cursor="view" data-cursor-label="Open">
                <span className={styles.top}>
                  <span className={styles.icon}>
                    <Icon name={service.icon} size={20} />
                  </span>
                  <span className={cx(styles.n, "mono")}>{service.number}</span>
                </span>
                <span className={styles.name}>
                  {service.title}
                  {service.isNew && <span className={cx(styles.new, "mono")}>New</span>}
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
      <Steps title="Same four steps, every job." steps={workProcess.steps} eyebrow="How every job runs" />
    </>
  );
}
