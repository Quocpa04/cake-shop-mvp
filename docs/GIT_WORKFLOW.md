# Quy trình Git cho 2 developer

## Nhánh

- `main`: chỉ chứa phiên bản demo ổn định.
- `develop`: tích hợp công việc hằng ngày.
- `feature/mobile-<ten>`: mobile.
- `feature/api-<ten>`: backend.
- `feature/admin-<ten>`: admin/kitchen.
- `fix/<ten-loi>`: sửa lỗi.

## Bắt đầu một chức năng

```powershell
git switch develop
git pull --rebase origin develop
git switch -c feature/mobile-catalog
```

Commit nhỏ và có ý nghĩa:

```powershell
git add apps/mobile packages/shared
git commit -m "feat(mobile): add product catalog screen"
```

Trước khi gửi code:

```powershell
git fetch origin
git rebase origin/develop
npm.cmd test
git push -u origin feature/mobile-catalog
```

Không commit `.env`, token, OTP production, khóa thanh toán hoặc file build. Không dùng chung một feature branch cho hai developer.

## Quy ước commit

- `feat(scope): ...` chức năng mới.
- `fix(scope): ...` sửa lỗi.
- `test(scope): ...` bổ sung kiểm thử.
- `docs(scope): ...` tài liệu.
- `chore(scope): ...` cấu hình/công cụ.

## Quyền sở hữu ban đầu

- Dev 1: `apps/mobile`.
- Dev 2: `apps/api`, `apps/admin-web`.
- `packages/shared` và `docs/API_CONTRACT.md`: thay đổi phải báo người còn lại trước khi merge.
