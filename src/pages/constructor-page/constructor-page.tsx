import { useSelector } from '../../services/store';
import { FC } from 'react';
import styles from './constructor-page.module.css';

import { BurgerIngredients, BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';

export const ConstructorPage: FC = () => {
  // 1. Достаем состояние загрузки из стора
  const { loading } = useSelector((state) => state.ingredients);

  // 2. Если данные еще в пути, показываем прелоадер, как просит инструкция
  if (loading) {
    return <Preloader />;
  }

  // 3. Если загрузка окончена, показываем сам конструктор
  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
