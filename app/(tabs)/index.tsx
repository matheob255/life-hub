import { useEffect } from 'react';
import SubcategoryList from '../../components/subcategories/SubcategoryList';
import { initDatabase } from '../../db/migrate';
import { seedData } from '../../db/seed';

export default function DailyScreen() {
  useEffect(() => {
    const init = async () => {
      await initDatabase();
      await seedData();
    };
    init();
  }, []);

  return <SubcategoryList categoryId={1} categoryName="Daily" categoryColor="#FF6B6B" />;
}
