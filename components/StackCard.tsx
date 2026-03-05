import styles from './StackCard.module.css';

export function StackCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: React.ReactNode }) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrap}>{icon}</div>
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        <p className={styles.desc}>{description}</p>
      </div>
    </div>
  );
}
