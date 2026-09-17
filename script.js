const filters = document.querySelectorAll('.filter');
const products = document.querySelectorAll('.product-card');

filters.forEach(filter => filter.addEventListener('click', () => {
	filters.forEach(item => item.classList.remove('active'));
	filter.classList.add('active');

	const category = filter.dataset.filter;
	products.forEach(product => {
		product.hidden = category !== 'all' && product.dataset.category !== category;
	});
}));

let bagCount = 0;
const toast = document.getElementById('toast');

document.querySelectorAll('.product-card').forEach(card => card.addEventListener('click', event => {
	if (!event.target.classList.contains('heart')) return;

	bagCount += 1;
	document.getElementById('bag-count').textContent = bagCount;
	toast.classList.add('show');
	window.setTimeout(() => toast.classList.remove('show'), 2200);
}));

document.querySelectorAll('.heart').forEach(heart => heart.addEventListener('click', event => {
	event.stopPropagation();
	heart.textContent = heart.textContent === '♡' ? '♥' : '♡';
	heart.classList.toggle('saved');
}));

document.getElementById('newsletter-form').addEventListener('submit', event => {
	event.preventDefault();
	document.getElementById('form-message').textContent = 'You are on the list. Welcome in.';
	event.target.reset();
});
