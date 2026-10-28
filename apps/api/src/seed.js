export const accessories = [
  { id: 'acc-candle', name: 'Nến sinh nhật', price: 15000 },
  { id: 'acc-card', name: 'Thiệp viết tay', price: 20000 },
  { id: 'acc-knife', name: 'Bộ dao nĩa', price: 10000 },
  { id: 'acc-firework', name: 'Pháo giấy mini', price: 25000 },
];

const image = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=85`;

export const products = [
  ['p01', 'Bánh Dâu Nàng Thơ', 'Bánh kem tươi phủ dâu tây, vị thanh nhẹ.', 'Sinh nhật', image('photo-1578985545062-69928b1d9587'), false, ['Trứng', 'Sữa', 'Gluten']],
  ['p02', 'Chocolate Midnight', 'Cốt chocolate đậm, ganache Bỉ và cacao.', 'Chocolate', image('photo-1571115177098-24ec42ed204d'), false, ['Trứng', 'Sữa', 'Gluten']],
  ['p03', 'Tiramisu Classic', 'Mascarpone, cà phê và cacao nguyên chất.', 'Bánh lạnh', image('photo-1571877227200-a0d98ea607e9'), false, ['Trứng', 'Sữa', 'Gluten']],
  ['p04', 'Mango Mousse', 'Mousse xoài chua ngọt trên đế biscuit.', 'Bánh lạnh', image('photo-1559620192-032c4bc4674e'), false, ['Sữa', 'Gluten']],
  ['p05', 'Red Velvet Love', 'Red velvet mềm ẩm cùng kem cheese.', 'Kỷ niệm', image('photo-1586788680434-30d324b2d46f'), false, ['Trứng', 'Sữa', 'Gluten']],
  ['p06', 'Matcha Azuki', 'Matcha Nhật Bản và nhân đậu đỏ.', 'Bánh kem tươi', image('photo-1563729784474-d77dbb933a9e'), false, ['Trứng', 'Sữa', 'Gluten']],
  ['p07', 'Princess Garden', 'Bánh tạo hình khu vườn công chúa.', 'Theo chủ đề', image('photo-1535254973040-607b474cb50d'), true, ['Trứng', 'Sữa', 'Gluten']],
  ['p08', 'Minimal White', 'Thiết kế tối giản với hoa kem thanh lịch.', 'Kỷ niệm', image('photo-1464349095431-e9a21285b5f3'), true, ['Trứng', 'Sữa', 'Gluten']],
  ['p09', 'Berry Yogurt', 'Kem yogurt và các loại berry tươi.', 'Bánh lạnh', image('photo-1488477181946-6428a0291777'), false, ['Sữa', 'Gluten']],
  ['p10', 'Salted Caramel', 'Caramel mặn cân bằng cùng vanilla.', 'Bánh kem tươi', image('photo-1621303837174-89787a7d4729'), false, ['Trứng', 'Sữa', 'Gluten', 'Hạt']],
  ['p11', 'Mini Bento Happy', 'Bánh bento nhỏ cho 1–2 người.', 'Bánh mini', image('photo-1519915028121-7d3463d20b13'), false, ['Trứng', 'Sữa', 'Gluten']],
  ['p12', 'Wedding Pearl', 'Bánh hai tầng trang trí ngọc trai.', 'Bánh cưới', image('photo-1606890737304-57a1ca8a5b62'), true, ['Trứng', 'Sữa', 'Gluten']],
].map(([id, name, description, category, imageUrl, preorder, allergens], index) => {
  const base = 260000 + index * 25000;
  return {
    id, name, description, category, imageUrl, preorder, allergens,
    storage: 'Bảo quản lạnh 2–8°C, dùng ngon nhất trong 24 giờ.',
    status: 'ACTIVE',
    variants: [
      { id: `${id}-v16`, size: '16cm', servings: '4–6 người', price: base },
      { id: `${id}-v18`, size: '18cm', servings: '6–8 người', price: base + 90000 },
      { id: `${id}-v20`, size: '20cm', servings: '8–12 người', price: base + 180000 },
    ],
  };
});

export function initialDatabase() {
  return { users: [], otpRequests: [], products, accessories, orders: [], payments: [], idempotency: {}, statusLogs: [] };
}
