let CURRENT_CURRENCY = "";
let CONVERT_CURRENCY = "";
const MY_WALLET = {};

function getUniqueCurrencies(data) {
  const currencies = data.map((item) => item.currency);
  const uniqueCurrencies = [...new Set(currencies)];

  return uniqueCurrencies;
}

function genRandomColor() {
  const randomColor = `#${faker.datatype.hexaDecimal(6).slice(2)}`;
  return randomColor;
}

function renderCurrentLogo(curreny) {
  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${curreny}.svg`;
}

function renderCurrencyTooltip(content) {
  const toolip = document.createElement("div");
  toolip.classList.add(
    "absolute",
    "left-1/2",
    "bottom-full",
    "mb-2",
    "w-max",
    "px-3",
    "py-1",
    "text-sm",
    "text-white",
    "bg-gray-800",
    "rounded",
    "opacity-0",
    "transition-opacity",
    "group-hover:opacity-100",
    "transform",
    "-translate-x-1/2"
  );
  toolip.innerText = content;
  const subDiv = document.createElement("div");
  subDiv.classList.add(
    "absolute",
    "left-1/2",
    "top-full",
    "-translate-x-1/2",
    "w-0",
    "h-0",
    "border-4",
    "border-transparent",
    "border-t-gray-800"
  );
  toolip.appendChild(subDiv);

  return toolip;
}

async function getPrices() {
  const priceKey = "prices";
  const ttl = 5 * 60 * 1000; // 5 minutes

  let cachedData = localStorage.getItem(priceKey);
  let cachedDataObj = { exp: 0, prices: [], uniqueCurrencies: [] };

  if (!!cachedData) {
    cachedDataObj = JSON.parse(cachedData);
    const now = new Date();

    if (now.getTime() < cachedDataObj.exp) {
      return cachedDataObj;
    }
  }

  try {
    const resp = await fetch("https://interview.switcheo.com/prices.json");
    let data = await resp.json();

    if (data?.length > 0) {
      // standardlize currency name
      data = data.map((item) => {
        if (
          item.currency.substring(0, 2) === "ST" &&
          item.currency !== "STRD"
        ) {
          item.currency = "st" + item.currency.substring(2);
        }

        if (item.currency === "RATOM") {
          item.currency = "rATOM";
        }

        item.color = genRandomColor();
        return item;
      });

      cachedDataObj = {
        exp: new Date().getTime() + ttl,
        prices: data,
        uniqueCurrencies: getUniqueCurrencies(data),
      };
      cachedData = JSON.stringify(cachedDataObj);
      localStorage.setItem(priceKey, cachedData);
    }

    return cachedDataObj;
  } catch {
    return cachedDataObj;
  }
}

function toggleDropdown(e) {
  const ul = e.target.nextElementSibling;

  if (ul) {
    addEventListener("click", (clickEvent) => {
      if (clickEvent.target !== e.target) {
        ul.classList.add("hidden");
      }
    });

    ul.classList.remove("hidden");
  }
}

function setCurrencyImages(className, name) {
  [...document.getElementsByClassName(className)].forEach((img) => {
    img.src = renderCurrentLogo(name);
    img.alt = name;
  });
}

function setCurrencies(className, text) {
  [...document.getElementsByClassName(className)].forEach(
    (element) => (element.innerHTML = text)
  );
}

function renderCurrencyList(prices, boughtCurrencies, uniqueCurrencies) {
  [...document.getElementsByClassName("currencies")].forEach((ul, i) => {
    ul.innerHTML = "";

    const currencyItems = (i === 0 ? boughtCurrencies : uniqueCurrencies).map(
      (currency) => {
        const li = document.createElement("li");
        li.classList.add(
          "flex",
          "items-left",
          "pl-3",
          "pr-5",
          "py-2",
          "justify-end",
          "h-[44px]",
          "cursor-pointer",
          "hover:bg-gray-100"
        );
        const img = document.createElement("img");
        img.classList.add("size-7", "mr-1", "pointer-events-none");
        img.src = renderCurrentLogo(currency);
        img.alt = currency;

        li.appendChild(img);
        li.appendChild(document.createTextNode(currency));

        li.onclick = (e) => {
          const selectedCurrency = e.target.innerText;
          if (i === 0) {
            setCurrencies("current-curency", selectedCurrency);
            setCurrencyImages("current-curency-image", selectedCurrency);
            CURRENT_CURRENCY = selectedCurrency;
            convert(
              "input-amount",
              prices,
              document.getElementById("input-amount").value
            );

            document.getElementById("your_asset").innerText =
              MY_WALLET[selectedCurrency].amount + " " + selectedCurrency;
          } else if (i === 1) {
            setCurrencies("convert-curency", selectedCurrency);
            setCurrencyImages("convert-curency-image", selectedCurrency);
            CONVERT_CURRENCY = selectedCurrency;
            convert(
              "output-amount",
              prices,
              document.getElementById("output-amount").value
            );
          }
        };

        return li;
      }
    );

    ul.append(...currencyItems);
  });
}

function exchange({ target }, prices) {
  if (isNaN(target.value)) {
    target.value = target.value.replace(/\D/g, "");
    return;
  }
  convert(target.id, prices, +target.value);
}

function convert(from, prices, orgPrice) {
  const currentPrice = prices.find((p) => p.currency === CURRENT_CURRENCY);
  const convertPrice = prices.find((p) => p.currency === CONVERT_CURRENCY);

  if (from === "input-amount") {
    document.getElementById("output-amount").value =
      (orgPrice * currentPrice.price) / convertPrice.price;
  } else if (from === "output-amount") {
    document.getElementById("input-amount").value =
      (orgPrice * convertPrice.price) / currentPrice.price;
  }
}

function generateWallet(totalUSD, boughtCurrencies, prices) {
  boughtCurrencies.forEach((currency) => {
    const eachCurrencyUSD = faker.random.number({ min: 0, max: totalUSD });
    totalUSD = totalUSD - eachCurrencyUSD;
    const currentPrice = prices.find((p) => p.currency === currency);

    MY_WALLET[currency] = {
      currency,
      usd: eachCurrencyUSD,
      amount: eachCurrencyUSD / currentPrice.price,
      color: currentPrice.color,
    };
  });

  const usd = prices.find((p) => p.currency === "USD");
  MY_WALLET["USD"] = {
    currency: "USD",
    usd: totalUSD,
    amount: totalUSD,
    color: usd.color,
  };

  return MY_WALLET;
}

function createAssetBar(totalUSD) {
  const bar = document.getElementById("asset-bar");
  bar.innerHTML = "";

  for (const currency in MY_WALLET) {
    const asset = MY_WALLET[currency];
    const percentage = (asset.usd / totalUSD) * 100;
    const span = document.createElement("span");
    span.classList.add(
      "h-full",
      "inline-block",
      "relative",
      "group",
      "cursor-pointer",
      `w-[${percentage}%]`
    );
    span.style.backgroundColor = asset.color;
    const tooltip = renderCurrencyTooltip(
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      })
        .format(asset.amount)
        .replace("$", "") +
        " " +
        currency
    );
    span.appendChild(tooltip);

    bar.appendChild(span);
  }
}

async function bootstrap() {
  const totalUSD = faker.random.number({ min: 1000, max: 100000 });
  const { prices, uniqueCurrencies } = await getPrices();
  const totalCurrencies = uniqueCurrencies.length;

  // mock coin currencies
  let boughtCurrencies = [
    ...new Set([
      uniqueCurrencies[
        faker.random.number({ min: 0, max: totalCurrencies - 1 })
      ],
      uniqueCurrencies[
        faker.random.number({ min: 0, max: totalCurrencies - 1 })
      ],
      uniqueCurrencies[
        faker.random.number({ min: 0, max: totalCurrencies - 1 })
      ],
      uniqueCurrencies[
        faker.random.number({ min: 0, max: totalCurrencies - 1 })
      ],
      uniqueCurrencies[
        faker.random.number({ min: 0, max: totalCurrencies - 1 })
      ],
      "USD",
    ]),
  ];

  CURRENT_CURRENCY =
    boughtCurrencies[
      faker.random.number({ min: 0, max: boughtCurrencies.length - 2 })
    ];

  CONVERT_CURRENCY =
    uniqueCurrencies[faker.random.number({ min: 0, max: totalCurrencies - 1 })];

  generateWallet(totalUSD, boughtCurrencies, prices);

  createAssetBar(totalUSD);

  setCurrencies("current-curency", CURRENT_CURRENCY);
  setCurrencyImages("current-curency-image", CURRENT_CURRENCY);
  setCurrencies("convert-curency", CONVERT_CURRENCY);
  setCurrencyImages("convert-curency-image", CONVERT_CURRENCY);

  document
    .getElementById("input-amount")
    .addEventListener("input", (e) => exchange(e, prices));

  document
    .getElementById("output-amount")
    .addEventListener("input", (e) => exchange(e, prices));

  document.getElementById("btn-exchange").addEventListener("click", () => {
    const amount = +document.getElementById("input-amount").value;
    if (amount > MY_WALLET[CURRENT_CURRENCY].amount) {
      alert(
        "Cannot exchange: Your current amount is greater than the amount to convert."
      );
      return;
    }

    const matchedCurrency = prices.find((p) => p.currency === CURRENT_CURRENCY);
    const convertCurrency = prices.find((p) => p.currency === CONVERT_CURRENCY);

    const amountUSD = amount * matchedCurrency.price;
    const converedAmount = amountUSD / convertCurrency.price;

    MY_WALLET[CURRENT_CURRENCY].amount -= amount;
    MY_WALLET[CURRENT_CURRENCY].usd -= amountUSD;

    document.getElementById("your_asset").innerText =
      MY_WALLET[CURRENT_CURRENCY].amount + " " + CURRENT_CURRENCY;

    if (MY_WALLET[CURRENT_CURRENCY].amount === 0) {
      const deleteIdx = boughtCurrencies.findIndex(
        (v) => v === CURRENT_CURRENCY
      );
      boughtCurrencies.splice(deleteIdx, 1);
    }

    const isBought = boughtCurrencies.includes(CONVERT_CURRENCY);
    if (!isBought) {
      boughtCurrencies.push(CONVERT_CURRENCY);

      MY_WALLET[CONVERT_CURRENCY] = {
        currency: CONVERT_CURRENCY,
        amount: converedAmount,
        usd: amountUSD,
        color: matchedCurrency.color,
      };
    } else {
      MY_WALLET[CONVERT_CURRENCY].amount += converedAmount;
      MY_WALLET[CONVERT_CURRENCY].usd += amountUSD;
    }

    renderCurrencyList(prices, boughtCurrencies, uniqueCurrencies);
    createAssetBar(totalUSD, MY_WALLET);
  });

  document.getElementById("your_asset").innerText =
    MY_WALLET[CURRENT_CURRENCY].amount + " " + CURRENT_CURRENCY;

  const fullName = faker.name.firstName() + " " + faker.name.lastName();
  document.getElementById("avatar").innerHTML = multiavatar(fullName);
  document.getElementById("full-name").innerHTML = fullName;
  document.getElementById("my-usd").append(
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(totalUSD)
  );

  renderCurrencyList(prices, boughtCurrencies, uniqueCurrencies);
  convert("input-amount", prices, 1);
}

bootstrap();
