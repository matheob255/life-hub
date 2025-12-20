import { useLocalSearchParams } from 'expo-router';
import ListDetail from '../../components/details/ListDetail';
import TravelsDetail from '../../components/details/TravelsDetail';
import TableDetail from '../../components/details/TableDetail';
import BudgetDetail from '../../components/details/BudgetDetail';
import ImportantDatesDetail from '../../components/details/ImportantDatesDetail';

export default function SubcategoryScreen() {
  const params = useLocalSearchParams<{
    id: string;
    name: string;
    icon: string;
    color: string;
    type: string;
  }>();

  const subcategoryId = Number(params.id);
  const name = params.name ?? '';
  const icon = params.icon ?? '';
  const color = (params.color as string) ?? '#6366f1';
  const type = params.type ?? 'list';

  // MOVIES / BOOKS / SNEAKERS / CONCERTS -> table view
  if (name === 'Movies') {
    return (
      <TableDetail
        subcategoryId={subcategoryId}
        name={name}
        icon={icon}
        color={color}
        columns={[
          { key: 'title', label: 'Title', width: 2 },
          { key: 'director', label: 'Director', width: 2 },
          { key: 'grade', label: 'Grade', width: 1, align: 'center' },
          { key: 'thoughts', label: 'Thoughts', width: 3 },
        ]}
      />
    );
  }

  if (name === 'Books') {
    return (
      <TableDetail
        subcategoryId={subcategoryId}
        name={name}
        icon={icon}
        color={color}
        columns={[
          { key: 'title', label: 'Title', width: 2 },
          { key: 'author', label: 'Author', width: 2 },
          { key: 'status', label: 'Status', width: 1, align: 'center' },
          { key: 'thoughts', label: 'Thoughts', width: 3 },
        ]}
      />
    );
  }

  if (name === 'Sneakers') {
    return (
      <TableDetail
        subcategoryId={subcategoryId}
        name={name}
        icon={icon}
        color={color}
        columns={[
          { key: 'title', label: 'Pair', width: 3 },
          { key: 'brand', label: 'Brand / Model', width: 3 },
          { key: 'size', label: 'Size', width: 1, align: 'center' },
          { key: 'notes', label: 'Notes', width: 2 },
        ]}
      />
    );
  }

  if (name === 'Concerts') {
    return (
      <TableDetail
        subcategoryId={subcategoryId}
        name={name}
        icon={icon}
        color={color}
        columns={[
          { key: 'artist', label: 'Artist', width: 3 },
          { key: 'times', label: 'Times', width: 1, align: 'center' },
          { key: 'where', label: 'Where', width: 3 },
          { key: 'notes', label: 'Notes', width: 2 },
        ]}
      />
    );
  }

  // TRAVELS
  if (name === 'Travels') {
    return (
      <TravelsDetail
        subcategoryId={subcategoryId}
        name={name}
        icon={icon}
        color={color}
      />
    );
  }

  // MONTHLY BUDGET
  if (name === 'Monthly Budget') {
    return (
      <BudgetDetail
        subcategoryId={subcategoryId}
        name={name}
        icon={icon}
        color={color}
      />
    );
  }

  // IMPORTANT DATES
  if (name === 'Important Dates') {
    return (
      <ImportantDatesDetail
        subcategoryId={subcategoryId}
        name={name}
        icon={icon}
        color={color}
      />
    );
  }

  // DEFAULT: simple list (shopping, todos, etc.)
  return (
    <ListDetail
      subcategoryId={subcategoryId}
      name={name}
      icon={icon}
      color={color}
    />
  );
}
