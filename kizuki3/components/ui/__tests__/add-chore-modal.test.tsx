import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { AddChoreModal } from '../add-chore-modal';

const baseProps = {
  visible: true,
  onClose: jest.fn(),
  onAdd: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AddChoreModal', () => {
  it('タイトルが空のとき「追加する」ボタンが無効', () => {
    render(<AddChoreModal {...baseProps} />);
    const btn = screen.getByText('追加する');
    expect(btn).toBeOnTheScreen();
    // disabled prop はpressableが持つ — 直接押しても onAdd が呼ばれないことで確認
    fireEvent.press(btn);
    expect(baseProps.onAdd).not.toHaveBeenCalled();
  });

  it('タイトル入力後に追加するとonAddが呼ばれる', () => {
    render(<AddChoreModal {...baseProps} />);
    fireEvent.changeText(screen.getByPlaceholderText('例：食器洗い'), '掃除機がけ');
    fireEvent.press(screen.getByText('追加する'));
    expect(baseProps.onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '掃除機がけ',
        lastDoneBy: 'あなた',
      }),
    );
  });

  it('lastDoneByを入力するとonAddに反映される', () => {
    render(<AddChoreModal {...baseProps} />);
    fireEvent.changeText(screen.getByPlaceholderText('例：食器洗い'), '洗濯');
    fireEvent.changeText(screen.getByPlaceholderText('例：お母さん'), 'お父さん');
    fireEvent.press(screen.getByText('追加する'));
    expect(baseProps.onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ lastDoneBy: 'お父さん' }),
    );
  });

  it('説明を入力するとonAddに反映される', () => {
    render(<AddChoreModal {...baseProps} />);
    fireEvent.changeText(screen.getByPlaceholderText('例：食器洗い'), 'ゴミ出し');
    fireEvent.changeText(screen.getByPlaceholderText('例：夕食後の食器を洗う'), '月曜と木曜');
    fireEvent.press(screen.getByText('追加する'));
    expect(baseProps.onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ description: '月曜と木曜' }),
    );
  });

  it('送信後にonCloseが呼ばれる', () => {
    render(<AddChoreModal {...baseProps} />);
    fireEvent.changeText(screen.getByPlaceholderText('例：食器洗い'), 'テスト');
    fireEvent.press(screen.getByText('追加する'));
    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('visible=falseのときモーダルが非表示', () => {
    render(<AddChoreModal {...baseProps} visible={false} />);
    expect(screen.queryByText('家事を追加')).toBeNull();
  });

  it('頻度ボタンを選択するとonAddに反映される', () => {
    render(<AddChoreModal {...baseProps} />);
    fireEvent.changeText(screen.getByPlaceholderText('例：食器洗い'), 'テスト');
    fireEvent.press(screen.getByText('毎日'));
    fireEvent.press(screen.getByText('追加する'));
    expect(baseProps.onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ frequency: 'daily' }),
    );
  });
});
