import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import HomeScreen from '../index';

describe('HomeScreen', () => {
  it('初期データの家事が表示される', () => {
    render(<HomeScreen />);
    expect(screen.getByText('食器洗い')).toBeOnTheScreen();
    expect(screen.getByText('ゴミ出し')).toBeOnTheScreen();
    expect(screen.getByText('洗濯')).toBeOnTheScreen();
    expect(screen.getByText('掃除機がけ')).toBeOnTheScreen();
  });

  it('＋ボタンを押すとモーダルが開く', () => {
    render(<HomeScreen />);
    fireEvent.press(screen.getByText('＋'));
    expect(screen.getByText('家事を追加')).toBeOnTheScreen();
  });

  it('モーダルから家事を追加するとリストに表示される', () => {
    render(<HomeScreen />);
    fireEvent.press(screen.getByText('＋'));
    fireEvent.changeText(screen.getByPlaceholderText('例：食器洗い'), '庭の草むしり');
    fireEvent.press(screen.getByText('追加する'));
    expect(screen.getByText('庭の草むしり')).toBeOnTheScreen();
  });

  it('家事カードをタップすると「あなた」が前回担当者になる', () => {
    render(<HomeScreen />);
    fireEvent.press(screen.getByText('食器洗い'));
    expect(screen.getByText('前回：あなた')).toBeOnTheScreen();
  });
});
