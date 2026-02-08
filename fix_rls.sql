-- 現在の「公開記事のみ表示」というポリシーを削除
drop policy "Public can view published articles" on articles;

-- 「すべての記事（下書き含む）を表示許可」に変更
create policy "Enable read access for all users" on articles for select using (true);

-- カテゴリも念のため全て表示許可
drop policy "Public can view categories" on categories;
create policy "Enable read access for all users" on categories for select using (true);
