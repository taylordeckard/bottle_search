import Title from "./title";
import Search from './search';
import styles from "./toolbar.module.scss";

export default function Toolbar() {
  return (
    <>
      <Title  className={styles.title}/>
      <Search className={styles.search}/>
    </>
  );
}
