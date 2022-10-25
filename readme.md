## label
### 優先度系
必ずづける、優先度がついていないPRは許容しない、Priorityの二重指定は許容しない
- 👑Priority: Critical🚀
  - 緊急、hotfix等
- 👑Priority: High✈️
  - 高、これが完了しないと後続のタスクに影響が大きい
- 👑Priority: Medium🚊
  - 中、基本はこれ
- 👑Priority: Low🚲
  - 低

### タイプ系
リリースノートの区分けに直結する、どれか一つをつける、Typeの二重指定は許容しない  
ついていないPRはすべてOther Changes行き  
複数のtypeの変更が混ざっている場合はPRを分割する  
主となる変更に必要なtypeの違う対応や、軽微な変更修正等は許容する
- 🔑Type: Feature✨
  - 機能
- 🔑Type: Bug🐛
  - bug fix 壊れていた部分の修正
- 🔑Type: ️Breaking change⚠
  - 破壊的変更、機能削除
- 🔑Type: Document📝
  - readme等の追加修正
- 🔑Type: Refactoring♻️
  - コード整理など、機能に影響を及ぼさない変更
- 🔑Type: Performance💹
  - パフォーマンスチューニング、およびそれにかかわる変更
- 🔑Type: Test💡
  - テストのみの変更
- 🔑Type: Maintenance🔧
  - CI/CD,Lint,build周り等開発者向けの変更

### ステータス系
Statusの二重指定は許容しない
- 🚥Status: WIP🚧
  - 作業中
- 🚥Status: Review Needed👀
  - レビューして
- 🚥Status: Pending🔒
  - 確認事項等があり凍結中、レビューも不要
- 🚥Status: Approved👍
  - レビュー完了、mergeできる

### Feedback系
- 🔎Feedback: Research
  - 調査タスク
  - このlabelがついているものは本流のブランチにmergeしない
- ❓Feedback: Question
  - アドバイス、意見求む
- 🆘 Feedback: Help
  - サポート求む

### Close系
Close理由が必要、理由はコメント追加ではなくDescriptionを編集して追記する  
普通にmergeできたものについてはClose系タグは不要
- ❎Close: Wontfix🔜
  - 対応しない理由を書いてclose
- ❎Close: Invalid❌
  - 対応不十分、対応不可能、何が、なんでだめだったか理由を書いてclose
- ❎Close: Duplicate🔚
  - 重複issue/PR、内容を書いてclose

### その他
- ⛔Do not merge
  - merge禁止
- 🚫Ignore for release note
  - リリースノートに反映しない