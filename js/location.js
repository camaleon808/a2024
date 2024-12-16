const subCategories = {
    lodging: ['lodging', 'tourist_attraction', 'campground', 'rv_park'], // 숙박 및 관광
    food: ['restaurant', 'cafe', 'bakery', 'meal_delivery', 'meal_takeaway', 'food'], // 음식점
    shopping: [
      'shopping_mall', 'store', 'book_store', 'clothing_store', 
      'electronics_store', 'furniture_store', 'jewelry_store', 
      'department_store', 'convenience_store', 'grocery_or_supermarket'
    ], // 쇼핑 및 상업
    outdoor: ['park', 'zoo', 'aquarium', 'amusement_park', 'natural_feature'], // 야외 활동 및 자연
    culture: ['art_gallery', 'museum', 'library', 'movie_theater', 'stadium'], // 문화 및 예술
    transport: [
      'airport', 'bus_station', 'subway_station', 'train_station', 
      'taxi_stand', 'transit_station', 'car_rental', 'parking', 'gas_station'
    ], // 교통 및 여행
    alcohol: ['liquor_store', 'bar', 'night_club'], // 주류
    convenience: [
      'beauty_salon', 'hair_care', 'spa', 'laundry', 'car_repair', 
      'hardware_store', 'home_goods_store'
    ], // 기타 편의 시설
    health: ['hospital', 'pharmacy', 'doctor', 'dentist', 'veterinary_care', 'gym'], // 건강 및 의료
    public: [
      'school', 'university', 'post_office', 'city_hall', 
      'embassy', 'fire_station', 'police', 'local_government_office'
    ], // 공공 서비스 및 기관
    finance: ['atm', 'bank', 'accounting', 'insurance_agency', 'real_estate_agency'], // 금융 및 비즈니스
    religion: [
      'church', 'hindu_temple', 'mosque', 'synagogue', 'cemetery', 'place_of_worship'
    ] // 종교 및 기념
  };
  
function populateSubCategories() {
    const mainCategory = document.getElementById('mainCategory').value;
    const subCategorySelect = document.getElementById('subCategory');
    subCategorySelect.innerHTML = ''; // 기존 옵션 제거
  
    subCategories[mainCategory].forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      subCategorySelect.appendChild(option);
    });
  }
  
function searchPlaces() {
    if (!currentLocation.lat || !currentLocation.lng) {
      alert("위치를 먼저 설정하세요.");
      return;
    }
    const mainCategory = document.getElementById("mainCategory").value;
    const subCategory = document.getElementById("subCategory").value;
    const radius = document.getElementById("radius").value;
    const sortBy = document.getElementById("sortBy").value;
  
    if (!mainCategory || !subCategory) {
      alert("카테고리를 선택해주세요.");
      return;
    }
  
    // 현재 위치 가져오기
    const { lat, lng } = currentLocation;
  
    const request = {
      location: new google.maps.LatLng(lat, lng),
      radius: sortBy === "prominence" ? parseInt(radius, 10) : undefined,
      type: subCategory,
      rankBy: sortBy === "distance" ? google.maps.places.RankBy.DISTANCE : undefined,
    };
  
    const service = new google.maps.places.PlacesService(document.createElement("div"));
    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        updatePlaceSearchResultScreen(results, { mainCategory, subCategory, radius, sortBy });
      } else {
        alert("검색 결과가 없습니다. 조건을 변경해주세요.");
      }
    });
  }
  
  // 검색 결과 화면 업데이트
function updatePlaceSearchResultScreen(results, conditions) {
    // 화면 전환
    document.getElementById("placeModal").style.display = "none";
    document.getElementById("infoScreen").style.display = "none";
    document.getElementById("placeSearchResultScreen").style.display = "flex";
  
    // 조건 표시
    const conditionsContainer = document.getElementById("selectedConditions");
    conditionsContainer.innerHTML = `
      <h3>선택한 조건</h3>
      <p>중위 카테고리: ${conditions.mainCategory}</p>
      <p>하위 카테고리: ${conditions.subCategory}</p>
      <p>반경: ${conditions.radius || "거리 기반"}</p>
      <p>정렬 기준: ${conditions.sortBy}</p>
    `;
  
    // 장소 목록 표시
    const resultsContainer = document.querySelector(".place-list");
    resultsContainer.innerHTML = ""; // 기존 내용 초기화
  
    results.forEach((place, index) => {
      const placeElement = document.createElement("div");
      placeElement.className = "place-item";
      placeElement.innerHTML = `
        <h3>${place.name}</h3>
        <p>주소: ${place.vicinity || "정보 없음"}</p>
        <p>평점: ${place.rating || "정보 없음"} (${place.user_ratings_total || 0} 리뷰)</p>
      `;
      placeElement.addEventListener("click", () => {
        map.setCenter(place.geometry.location);
        map.setZoom(15);
      });
      resultsContainer.appendChild(placeElement);
    });
  
  // 지도 표시
    const mapContainer = document.getElementById("resultMap");
    let parent = mapContainer.parentElement;
  while (parent) {
    console.log("Parent element:", parent);
    console.log("Parent offsetWidth:", parent.offsetWidth);
    console.log("Parent offsetHeight:", parent.offsetHeight);
    parent = parent.parentElement;
  }
  ;
    mapContainer.innerHTML = ""; // 기존 지도 초기화
    
    
    if (currentLocation.lat && currentLocation.lng) {
      const map = new google.maps.Map(mapContainer, {
        center: currentLocation,
        zoom: 13,
      });
  
      results.forEach((place, index) => {
        const marker = new google.maps.Marker({
          position: place.geometry.location,
          map,
          label: `${index + 1}`,
        });
  
        marker.addListener("click", () => {
          map.setCenter(marker.getPosition());
          map.setZoom(15);
        });
      });
    } else {
      console.error("currentLocation이 비어 있음:", currentLocation);
      alert("현재 위치를 설정한 후 다시 시도하세요.");
    }
  }
  
function goBackToSearch() {
    document.getElementById('placeSearchResultScreen').style.display = 'none';
    document.getElementById('infoScreen').style.display = 'flex';
  }
  
  
  window.populateSubCategories=populateSubCategories;
  window.searchPlaces=searchPlaces;
  window.updatePlaceSearchResultScreen=updatePlaceSearchResultScreen;
  window.goBackToSearch=goBackToSearch;