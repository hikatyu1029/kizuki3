# kizuki3 — 家事感謝アプリ

家族の家事を記録・可視化するモバイルアプリ。誰がいつ何をやったかを色付きカードで表示し、家事への感謝を可視化する。

## 技術スタック

| 種別 | 内容 |
|------|------|
| フレームワーク | React Native 0.81 + Expo SDK 54 |
| 言語 | TypeScript 5.9（`strict: true`） |
| ルーティング | Expo Router（ファイルベース） |
| テスト | Jest + jest-expo + @testing-library/react-native |
| リント | expo lint（ESLint） |

## 開発セットアップ

```bash
cd kizuki3
npm install
npm run start        # Expo Dev Server 起動
npm test             # テスト実行（1回）
npm run test:watch   # テスト watch モード
npm run lint         # リント
```

## ディレクトリ構成

```
kizuki3/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # ホーム画面（家事リスト）
│   │   └── _layout.tsx        # タブナビゲーション設定
│   └── _layout.tsx            # ルートレイアウト
├── components/
│   ├── ui/
│   │   ├── chore-card.tsx     # 家事カードと Chore 型・getChoreColor 定義
│   │   └── add-chore-modal.tsx # 家事追加モーダル
│   ├── themed-text.tsx
│   └── themed-view.tsx
├── constants/
│   └── theme.ts               # カラー・フォント定数
└── hooks/
```

## テスト規約

**各ソースファイルには対応するユニットテストを必ず作成する。**

- 配置場所: ソースファイルと同じディレクトリの `__tests__/` フォルダ内
- 命名規則: `[ファイル名].test.ts` / `[ファイル名].test.tsx`
- 例: `components/ui/chore-card.tsx` → `components/ui/__tests__/chore-card.test.ts`
- 純粋関数はロジックのすべての分岐をカバーする
- コンポーネントは主要なユーザー操作（タップ、入力、送信）をカバーする
- `jest.fn()` でコールバックを検証し、実装詳細ではなく振る舞いをテストする

## 型定義の管理

- `Chore` 型と `Frequency` 型は `components/ui/chore-card.tsx` で定義・export する
- 型を使う側は `import { type Chore } from '@/components/ui/chore-card'` でインポートする
- 型の移動・変更は既存テストへの影響を確認してから行う

## データ永続化の方針

- **現在**: `useState` のみ（インメモリ）。アプリ再起動でデータはリセットされる
- **将来**: AsyncStorage または Zustand での永続化を予定
- 永続化レイヤーを追加する際は、ストレージの読み書きを `hooks/` に切り出し、`index.tsx` は状態管理に集中させる
- 永続化の実装前にこの CLAUDE.md を更新する

## git / ブランチ運用

| ブランチ | 用途 |
|----------|------|
| `main` | リリース用。直接コミットしない |
| `feature/*` | 新機能 |
| `fix/*` | バグ修正 |
| `claude/*` | Claude による自動実装ブランチ |

- コミットメッセージは日本語 + Conventional Commits 形式
  - 例: `feat: 家事追加モーダルを実装`
  - 例: `fix: 完了タップ後に色が更新されないバグを修正`
- 1コミット = 1つの変更の意図
- PR を出す前に `npm test` と `npm run lint` が通ることを確認する

## コーディング規約

- `any` 型は使わない。型推論できない場合は `unknown` を使い、絞り込む
- UIコンポーネントは `ThemedText` / `ThemedView` を使い、ハードコードされた色を避ける
- スタイルは `StyleSheet.create` でまとめる（インラインスタイルはダイナミックな値のみ許可）
- コメントは「なぜ」を書く。「何をしているか」はコードが示す
- コンポーネントに副作用が必要な場合は `hooks/` にカスタムフックを作成する

## 実装済み機能

- [x] 家事リスト表示（色付き緊急度バー）
- [x] 家事を完了済みにタップ
- [x] 新規家事追加モーダル

## 未実装 / 今後の予定

- [ ] データ永続化（AsyncStorage）
- [ ] 家族メンバー管理
- [ ] プッシュ通知（期限超過リマインダー）
