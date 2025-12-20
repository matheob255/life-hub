import { useEffect } from 'react';
import { initDatabase } from '../../db/migrate';
import { seedData } from '../../db/seed';
import SubcategoryList from '../../components/subcategories/SubcategoryList';

export default function DailyScreen() {
  useEffect(() => {
    const init = async () => {
      await initDatabase();
      await seedData();
    };
    init();
  }, []);

  return <SubcategoryList categoryId={1} categoryName="Daily" categoryColor="#6366f1" />;
}
