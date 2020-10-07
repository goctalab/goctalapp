import * as React from 'react';
import { DrawerActions } from '@react-navigation/native';

export const navigationRef = React.createRef();

export function openDrawer() {
  navigationRef.current?.dispatch(DrawerActions.openDrawer());
}

export function closeDrawer() {
  navigationRef.current?.dispatch(DrawerActions.closeDrawer());
}

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}
