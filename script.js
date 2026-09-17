const STORE_CONFIG = {
	name: 'Your Store',
	currency: 'Rs.'
};

const filters = document.querySelectorAll('.filter');
const products = [...document.querySelectorAll('.product-card')];
const toast = document.getElementById('toast');
const modalBackdrop = document.getElementById('modal-backdrop');
const productPanel = document.getElementById('product-panel');
const cartPanel = document.getElementById('cart-panel');
const checkoutPanel = document.getElementById('checkout-panel');
const cart = JSON.parse(localStorage.getItem('store-cart') || '[]');

const formatPrice = price => `${STORE_CONFIG.currency} ${Number(price).toLocaleString('en-PK')}`;
const productFromCard = card => ({
	id: card.dataset.id,
	name: card.dataset.name,
	price: Number(card.dataset.price),
	description: card.dataset.description,
	image: card.dataset.image,
	category: card.dataset.category
});
const allProducts = products.map(productFromCard);

const showToast = message => {
	toast.firstChild.textContent = `${message} `;
	toast.classList.add('show');
	window.setTimeout(() => toast.classList.remove('show'), 2200);
};

const openPanel = panel => {
	[productPanel, cartPanel, checkoutPanel].forEach(item => item.classList.remove('open'));
	panel.classList.add('open');
	panel.setAttribute('aria-hidden', 'false');
	modalBackdrop.hidden = false;
};

const closePanels = () => {
	[productPanel, cartPanel, checkoutPanel].forEach(panel => {
		panel.classList.remove('open');
		panel.setAttribute('aria-hidden', 'true');
	});
	modalBackdrop.hidden = true;
};

const saveCart = () => localStorage.setItem('store-cart', JSON.stringify(cart));

const renderCart = () => {
	const cartItems = document.getElementById('cart-items');
	const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
	const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
	document.getElementById('bag-count').textContent = itemCount;
	document.getElementById('cart-total').textContent = formatPrice(total);

	if (!cart.length) {
		cartItems.innerHTML = '<p class="empty-cart">Your bag is waiting for something considered.</p>';
		return;
	}

	cartItems.innerHTML = cart.map(item => `<div class="cart-item"><img src="${item.image}" alt="${item.name}"><div><h3>${item.name}</h3><p>${formatPrice(item.price)}</p><div class="quantity-control"><button data-cart-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-cart-action="increase" data-id="${item.id}" aria-label="Increase quantity">+</button><button class="remove-item" data-cart-action="remove" data-id="${item.id}">Remove</button></div></div></div>`).join('');
};

const addToCart = product => {
	const existing = cart.find(item => item.id === product.id);
	if (existing) existing.quantity += 1;
	else cart.push({ ...product, quantity: 1 });
	saveCart();
	renderCart();
	showToast(`${product.name} added to your bag`);
};

filters.forEach(filter => filter.addEventListener('click', () => {
	filters.forEach(item => item.classList.remove('active'));
	filter.classList.add('active');
	const category = filter.dataset.filter;
	products.forEach(product => { product.hidden = category !== 'all' && product.dataset.category !== category; });
}));

products.forEach(card => {
	const product = productFromCard(card);
	card.addEventListener('click', event => {
		if (event.target.closest('.heart') || event.target.closest('.add-to-cart')) return;
		document.getElementById('product-detail').innerHTML = `<img class="detail-image" src="${product.image}" alt="${product.name}"><div class="detail-copy"><p class="eyebrow">${product.category}</p><h2>${product.name}</h2><strong>${formatPrice(product.price)}</strong><p>${product.description}</p><button class="button button-dark detail-add" data-id="${product.id}">Add to bag <span>↗</span></button></div>`;
		openPanel(productPanel);
	});
	card.querySelector('.add-to-cart').addEventListener('click', () => addToCart(product));
	card.querySelector('.heart').addEventListener('click', event => {
		event.stopPropagation();
		event.currentTarget.textContent = event.currentTarget.textContent === '♡' ? '♥' : '♡';
		event.currentTarget.classList.toggle('saved');
	});
});

document.addEventListener('click', event => {
	const button = event.target.closest('[data-cart-action]');
	if (!button) return;
	const item = cart.find(entry => entry.id === button.dataset.id);
	if (!item) return;
	if (button.dataset.cartAction === 'increase') item.quantity += 1;
	if (button.dataset.cartAction === 'decrease') item.quantity -= 1;
	if (button.dataset.cartAction === 'remove' || item.quantity < 1) cart.splice(cart.indexOf(item), 1);
	saveCart();
	renderCart();
});

document.getElementById('product-panel').addEventListener('click', event => {
	const button = event.target.closest('.detail-add');
	if (button) addToCart(allProducts.find(product => product.id === button.dataset.id));
});
document.getElementById('open-cart').addEventListener('click', () => { renderCart(); openPanel(cartPanel); });
document.getElementById('open-checkout').addEventListener('click', () => { if (cart.length) openPanel(checkoutPanel); });
document.querySelectorAll('[data-close-panel]').forEach(button => button.addEventListener('click', closePanels));
modalBackdrop.addEventListener('click', closePanels);

document.getElementById('checkout-form').addEventListener('submit', event => {
	event.preventDefault();
	showToast('Order request received');
	event.target.reset();
	cart.length = 0;
	saveCart();
	renderCart();
	closePanels();
});

document.getElementById('newsletter-form').addEventListener('submit', event => {
	event.preventDefault();
	document.getElementById('form-message').textContent = 'You are on the list. Welcome in.';
	event.target.reset();
});

renderCart();
