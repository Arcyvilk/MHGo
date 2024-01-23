import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { Order } from '@mhgo/types';
import MUITable from '@mui/material/Table';

import s from './Table.module.scss';

export type TableHeader<U> = {
  id: keyof U | 'actions';
  label: string;
};

type Props<T, U> = {
  tableHeaders: TableHeader<U>[];
  items: T[][];
  order?: Order;
  setOrder?: (order: Order) => void;
  orderBy?: keyof U;
  setOrderBy?: (orderBy: keyof U) => void;
};
export function Table<
  T extends React.ReactNode,
  U extends Record<string, unknown>,
>({
  tableHeaders,
  items,
  order = 'desc',
  setOrder,
  orderBy = 'name',
  setOrderBy,
}: Props<T, U>) {
  const createSortHandler = (property: keyof U) => {
    if (setOrder && setOrderBy) {
      setOrderBy(property);
      setOrder(order === 'desc' ? 'asc' : 'desc');
    }
  };

  return (
    <div className={s.table}>
      <MUITable>
        <TableHead>
          <TableRow>
            {tableHeaders.map(headCell => (
              <TableCell
                sortDirection={orderBy === headCell.id ? order : false}>
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={() => createSortHandler(headCell.id)}>
                  {headCell.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              {item.map(i => (
                <TableCell>{i}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MUITable>
    </div>
  );
}

const ItemCell = ({ content }: { content: string }) => {
  return <div className={s.customCell}>{content}</div>;
};

Table.CustomCell = ItemCell;
