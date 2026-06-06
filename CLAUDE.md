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
- **将来**: Firebase Firestore でのリアルタイム同期（マルチデバイス・マルチ家族対応）
- 永続化レイヤーを追加する際は、読み書きを `hooks/` に切り出し、`index.tsx` は状態管理に集中させる

## Firebase アーキテクチャ設計

### 認証
- Google Sign In + Apple Sign In（App Store審査要件でAppleは必須）
- サインイン後に「家族を作成」または「招待コードで参加」を選択

### 認証フロー
```
起動
 └─ 未ログイン → Google / Apple でサインイン
       └─ familyId 未設定 → 「家族を作成」or「招待コードで参加」
             └─ ホーム画面（家事リスト）
```

### Firestoreデータ構造
```
/users/{userId}
  displayName: string
  photoURL?: string
  familyId?: string          // 参加済みなら設定
  provider: 'apple' | 'google'
  createdAt: timestamp
  plan: 'free' | 'premium'   // Freemium管理

/families/{familyId}
  name: string               // 例：「山田家」
  inviteCode: string         // 6桁ランダム文字列
  ownerUserId: string
  memberIds: string[]
  createdAt: timestamp

/families/{familyId}/chores/{choreId}
  title: string
  description?: string
  frequency: Frequency
  lastDoneDate: string
  lastDoneByUserId: string
  lastDoneByName: string     // 表示用（denormalized）
  updatedAt: timestamp
```

### セキュリティルール（必須）
```js
match /families/{familyId}/chores/{choreId} {
  allow read, write: if request.auth.uid in
    get(/databases/$(database)/documents/families/$(familyId)).data.memberIds;
}
```

### Freemiumの境界線
| 機能 | 無料 | プレミアム |
|------|------|----------|
| 家事の登録数 | 5件まで | 無制限 |
| 家族メンバー数 | 3人まで | 無制限 |
| 統計・完了履歴 | なし | あり |
| ホームウィジェット | なし | あり |

- 課金管理は **RevenueCat** を使用（App Store / Google Play 両対応）
- RevenueCat Webhook → Cloud Functions → Firestore の `plan` フィールドを更新

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

## 今後の実装ロードマップ

各フェーズに対応する GitHub Issue あり（ラベル: `enhancement`）。

### Phase 1：Firebase 基盤
1. [ ] Firebase SDK 導入・プロジェクトセットアップ
2. [ ] Google / Apple Sign In 実装
3. [ ] 家族作成・招待コードによる参加フロー

### Phase 2：Firestore 移行
4. [ ] Firestore CRUD（`useState` → Firestore に移行）
5. [ ] リアルタイムリスナー（`onSnapshot` で全端末に即時反映）

### Phase 3：収益化
6. [ ] Freemium 制限ロジック実装（家事5件・メンバー3人上限）
7. [ ] RevenueCat + アプリ内課金（月額・年額サブスクリプション）

### Phase 4：プロダクト完成度
8. [ ] UI改善（完了アニメーション・スワイプ削除・空状態・ダークモード対応）
9. [ ] 感謝機能（「ありがとう」ボタン・感謝数表示・感謝通知との連携）
10. [ ] 家事実施通知（期限リマインダー・完了通知・感謝通知）
