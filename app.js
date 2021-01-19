const container = document.querySelector('#main');
const cryptoCoinDataList = document.querySelector('#crypto-coin');
const sectionResult = document.querySelector('#section_result');

const cryptoCoinInput = document.querySelector('#input_crypto-coin');
const coinInput = document.querySelector('#input_coin');

const form = document.querySelector('#form');

const objSearch = {
	coin: '',
	cryptoCoin: '',
};

//Create a promise
const getCryptoCoins = (cryptoCoins) =>
	new Promise((resolve) => {
		resolve(cryptoCoins);
	});

document.addEventListener('DOMContentLoaded', () => {
	consultCryptoCoins();

	form.addEventListener('submit', submitFrom);

	cryptoCoinInput.addEventListener('input', readValue);
	coinInput.addEventListener('input', readValue);
});

function readValue(e) {
	objSearch[e.target.name] = e.target.value;
}
function selectCryptocoins(cryptoCoins) {
	cryptoCoins.forEach((cryptoCoin) => {
		const { FullName, Name } = cryptoCoin.CoinInfo;
		const option = document.createElement('option');
		option.value = Name;
		option.textContent = FullName;

		cryptoCoinDataList.appendChild(option);
	});
}

async function consultCryptoCoins() {
	const url =
		'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

	try {
		const answer = await fetch(url);
		const result = await answer.json();
		const CryptoCoins = await getCryptoCoins(result.Data);
		selectCryptocoins(CryptoCoins);
	} catch (error) {
		console.log(error);
	}
}

function submitFrom(e) {
	e.preventDefault();
	const { coin, cryptoCoin } = objSearch;
	if (coin === '' || cryptoCoin === '') {
		alert('Both fields are required');
		return;
	} else {
		readAPI();
	}
}

async function readAPI() {
	const { coin, cryptoCoin } = objSearch;
	const url = `https://min-api.cryptocompare.com/data/price?fsym=${cryptoCoin}&tsyms=${coin}`;
	//const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptoCoin}&tsyms=${coin}`;

	try {
		showSpinner();
		const answer = await fetch(url);
		const result = await answer.json();
		showResult(result[coin]);
	} catch (error) {
		showSpinner();
		console.log(error);
		alert('Incorrect data');
	}
}
function showResult(result) {
	cleanHTML();
	const valueInput = document.querySelector('#form_valor__input').value;
	const { coin, cryptoCoin } = objSearch;

	const options = { style: 'currency', currency: coin };
	const numberFormat = new Intl.NumberFormat('en-US', options).format(
		result * Number(valueInput)
	);

	const section = document.createElement('section');
	section.classList.add('section_result');
	section.innerHTML = `
      <div>
         <span class="coin-type">${valueInput} ${cryptoCoin} </span>
         <img class="img_arrow" src="./img/arrow.svg" alt="" />
      <span class="coin-type">${coin}</span>
      </div>
      <div><span class="total_result">${numberFormat}</span></div>
   `;
	sectionResult.appendChild(section);
}

function alert(msg) {
	const divAlert = document.querySelector('.form_error');
	if (!divAlert) {
		const divAlert = document.createElement('div');

		divAlert.classList.add('form_error');
		divAlert.innerHTML = `<span>${msg}</span>`;
		container.appendChild(divAlert);

		setTimeout(() => {
			divAlert.remove();
		}, 3000);
	}
}
function cleanHTML() {
	while (sectionResult.firstChild) {
		sectionResult.removeChild(sectionResult.firstChild);
	}
}
function showSpinner() {
	cleanHTML();
	const spinner = document.createElement('div');
	spinner.classList.add('spinner');
	spinner.innerHTML = `
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
   `;
	sectionResult.appendChild(spinner);
}
