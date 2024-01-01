import { TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import MUITable from '@mui/material/Table';

import s from './Table.module.scss';

type Props<T> = { tableHeaders: string[]; items: T[][] };
export function Table<T extends React.ReactNode>({
  tableHeaders,
  items,
}: Props<T>) {
  return (
    <div className={s.table}>
      <MUITable>
        <TableHead>
          <TableRow>
            {tableHeaders.map(header => (
              <TableCell>{header}</TableCell>
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
