import logo from "./logo.svg";
import React from "react";
import "./App.css";
import Title from "./components/Title";
const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

const catItem = (
  <li>
    <img src="https://cataas.com/cat/60b73094e04e18001194a309/says/react" />
  </li>
);

function CatItem(props) {
  return (
    <li>
      <img src={props.img} style={{ with: "150px", border: "1px solid red" }} />
    </li>
  );
}

function Favorites({ favorites }) {
  if (favorites.length == 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>;
  }

  return (
    <ul className="favorites">
      {favorites.map(
        (
          cat //배열의 리스트를 뽑아올 때 map 사용
        ) => (
          <CatItem img={cat} key={cat} />
        )
      )}
    </ul>
  );
}

const MainCard = ({ img, onHeartClick, alreadyFavorites }) => {
  const heartIcon = alreadyFavorites ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHeartClick}>{heartIcon}</button>
    </div>
  );
};

//es6 디스트럭처링 문법 적용 후
// const MainCard = ({img}) = > (
//   <img src="{img}" />
// )

const Form = ({ updateMainCat }) => {
  const [value, setValue] = React.useState("");
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [errorMessage, setErrorMessage] = React.useState("");

  function handleInputChange(e) {
    const userValue = e.target.value;
    //console.log(e.target.value.toUpperCase());
    //console.log(includesHangul(e.target.value)); //입력한 값에 한글이 포함되어 있는지 검사

    if (includesHangul(e.target.value)) {
      setErrorMessage("한글은 입력할 수 없습니다.");
    } else {
      setErrorMessage("");
    }
    setValue(userValue.toUpperCase());
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    if (value == "") {
      setErrorMessage("빈 값으로 만들 수 없습니다.");
      return;
    }
    updateMainCat(value);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="name"
        placeholder="영어 대사를 입력해주세요"
        value={value}
        onChange={handleInputChange}
      />
      <button type="submit">생성</button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
};

const App = () => {
  const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 =
    "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });

  const counterTitle = counter == null ? "" : counter + "번째 ";

  const [mainCatImg, setMainCat] = React.useState(CAT1); //초기값
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  });

  //const counterState = React.useState(1);
  //const counter = counterState[0];
  //const setCounter = counterState[1];
  console.log("카운터", counter);

  async function setInitialCat() {
    const newCat = await fetchCat("First cat");
    setMainCat(newCat);
  }

  const alreadyFavorites = favorites.includes(mainCatImg);

  React.useEffect(() => {
    setInitialCat();
  }, []);
  //useEffect는 함수를 내가 제한한 상황에서만 호출되도록 제어할 수 있음
  //[] 은 맨처음 생성되었을때만 호출되도록 하기 위해 사용

  //생성을 눌렀을 때 실행 함수
  async function updateMainCat(value) {
    //event.preventDefault(); //html기본동작이 form 전송 시 refresh => 이걸 써줌으로써 이벤트 기본동작 정지
    const newCat = await fetchCat(value);

    setMainCat(newCat); //캣2 이미지로 바꿈

    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    });
  }

  function handleHeartClick() {
    //console.log("하트 눌렀음");
    const nextFavorites = [...favorites, mainCatImg]; //...은 기존 배열 CAT1,CAT2를 펼친다음에 CAT3를 추가한다는 의미
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  return (
    <div>
      <Title>{counterTitle}고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard
        img={mainCatImg}
        onHeartClick={handleHeartClick}
        alreadyFavorites={alreadyFavorites}
      />
      <Favorites favorites={favorites} />
    </div>
  );
};

export default App;
