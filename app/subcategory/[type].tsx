import { useLocalSearchParams } from 'expo-router';
import ListDetail from '../../components/details/ListDetail';
import TrackerDetail from '../../components/details/TrackerDetail';
import JournalDetail from '../../components/details/JournalDetail';

export default function SubcategoryDetail() {
  const params = useLocalSearchParams();
  const { type, id, name, icon, color } = params;

  const commonProps = {
    subcategoryId: parseInt(id as string),
    name: name as string,
    icon: icon as string,
    color: color as string,
  };

  // Route to the appropriate detail screen
  if (type === 'list') {
    return <ListDetail {...commonProps} />;
  } else if (type === 'tracker') {
    return <TrackerDetail {...commonProps} />;
  } else if (type === 'journal') {
    return <JournalDetail {...commonProps} />;
  }

  return null;
}
