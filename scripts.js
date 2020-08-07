document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    // Declarations
    const positions = [
      {
        name: 'START',
        position: 0,
        text: 'WE ARE BREAKING OUR VOW OF SILENCE',
        textClasses: 'left middle',
      },
      {
        name: '1',
        position: 1,
        text: 'TALENT IS GIVEN TRUE SKILL IS EARNED',
        textClasses: 'left middle',
      },
      {
        name: '2',
        position: 2,
        text: 'BE FLEXIBLE TO CHANGE AND STURDY IN CONVICTION',
        textClasses: 'left middle',
      },
      {
        name: '3',
        position: 3,
        text: 'USE MANY SKILLS YET WORK AS ONE',
        textClasses: 'right middle',
      },
      {
        name: '4',
        position: 4,
        text: 'TO MASTER ANYTHING FIND INTEREST IN EVERYTHING',
        textClasses: 'right middle',
      },
      {
        name: '5',
        position: 5,
        text: 'INDIVIDUALS FLOURISH IF CULTURE AND WISDOM ARE SHARED',
        textClasses: 'left middle',
      },
      {
        name: '6',
        position: 6,
        text: 'TRAIN FOR PERFECTION BUT AIM FOR MORE',
        textClasses: 'left middle',
      },
      {
        name: '7',
        position: 7,
        text: 'TAKE PRIDE IN YOUR WORK BUT DO NOT SEEK PRAISE',
        textClasses: 'left middle',
      },
      {
        name: '8',
        position: 8,
        text: 'TEMPORARY SACRIFICE BRING LASTING RESULTS',
        textClasses: 'left middle',
      },
      {
        name: 'END',
        position: 9,
      },
    ];

    const background = document.querySelector('.wrapper');

    // How much we should scroll per position change
    const amountToScrollPerPositionChange = (
      background.scrollWidth
      - window.innerWidth
    ) / (positions.length - 1);
    
    const loadingScreen = document.querySelector('.loading-screen');
    const leftArrowIcon = document.querySelector('.left-arrow-icon');
    const rightArrowIcon = document.querySelector('.right-arrow-icon');
    const textPerPage = document.querySelector('.text-per-page');
    const positionsViewer = document.querySelector('.positions-viewer');

    let appFirstLoad = true;
    let movementIsEnabled = true;
    let currentPosition = 0;

    // -------------------------------------------------------------------------

    /**
     * Scrolls the background X amount of pixels
     */
    const scrollBackground = (amount) => {
      background.scrollBy({
        left: amount,
        behavior: 'smooth',
      });
    }

    /**
     * Sets the text of each background position
     */
    const handleTextPerPosition = () => {
      const setText = () => {
        if (positions[currentPosition].text) {
          textPerPage.setAttribute(
            'class',
            `text-per-page ${positions[currentPosition].textClasses}`,
          );
          
          textPerPage.innerHTML = positions[currentPosition].text;
          textPerPage.style.opacity = 1;
        }
      }
      
      // We don't want the text of the initial position to have a transition
      if (appFirstLoad) {
        setText();
        return;
      }

      // We wait until smooth scroll process is finished
      setTimeout(() => {
        setText();
        movementIsEnabled = true;
      }, 700);      
    }

    /**
     * Shows or hides an arrow icon depending of the background position
     */
    const handleArrowsVisibility = () => {
      if (currentPosition === positions.length - 1) {
        leftArrowIcon.style.display = 'block';
        rightArrowIcon.style.display = 'none';
      } else if (currentPosition === 0) {
        leftArrowIcon.style.display = 'none';
        rightArrowIcon.style.display = 'block';
      } else {
        leftArrowIcon.style.display = 'block';
        rightArrowIcon.style.display = 'block';
      }
    }

    /**
     * Handles the class of the previous and current position of
     * the positions viewer
     */
    const handleCurrentPositionInPositionsViewer = () => {
      positionsViewer.childNodes.forEach(positionElement => {
        if (positionElement.classList.contains('current')) {
          positionElement.classList.remove('current');
        }

        document.querySelector(
          `.position-${positions[currentPosition].name}`,
        ).classList.add('current');
      });
    }

    /**
     * Handles what happens when some handler requests a change of position
     */
    const handleMovement = (newPosition, amountToScroll) => {
      // If there is a scroll in process, stop
      if (!movementIsEnabled) {
        return;
      }

      if (appFirstLoad) {
        appFirstLoad = false;
      }
      
      // We disable the movement until the scroll is finished
      movementIsEnabled = false;

      // We slowly hide the text
      textPerPage.style.opacity = 0;

      // We wait until the opacity transition of the text is finished
      setTimeout(() => {
        // We clean the classes of any previous position text
        textPerPage.setAttribute('class', 'text-per-page');

        currentPosition = newPosition;
        scrollBackground(amountToScroll);
        handleArrowsVisibility();
        handleCurrentPositionInPositionsViewer();
        handleTextPerPosition();
      }, 300);
    }

    /**
     * Handles what happens when a position of the positions viewer is clicked
     */
    const handlePositionClick = (requestedPositionName) => {
      const clickedPosition = positions.filter(position => (
        position.name === requestedPositionName
      ))[0].position;

      // Nothing happens if the requested position is equal to the current one
      if (clickedPosition === currentPosition) {
        return;
      }

      handleMovement(
        clickedPosition,
        ((clickedPosition - currentPosition) * amountToScrollPerPositionChange),
      );
    }

    /**
     * Handles what happens when an arrow is  clicked
     */
    const handleArrowClick = (arrowDirection) => {
      if (arrowDirection === 'right') {
        handleMovement(currentPosition + 1, amountToScrollPerPositionChange);
      } else {
        handleMovement(currentPosition - 1, -amountToScrollPerPositionChange);
      }
    }

    // -------------------------------------------------------------------------

    leftArrowIcon.addEventListener('click', event => {
      handleArrowClick('left');
    })

    rightArrowIcon.addEventListener('click', event => {
      handleArrowClick('right');
    })

    // Define the positions viewer grid based on the length of array of positions
    positionsViewer.style.gridTemplateColumns = `repeat(${positions.length}, min-content)`;

    // Fill each grid column with the respective position name
    positions.forEach(position => {
      let positionElement = document.createElement('span');
      positionElement.classList.add(`position-${position.name}`);

      // Event listener for each position
      positionElement.addEventListener(
        'click',
        () => handlePositionClick(position.name),
      );
      
      let positionText = document.createTextNode(position.name);
      positionElement.appendChild(positionText);
      positionsViewer.appendChild(positionElement);
    });

    // Some initial handlings
    handleTextPerPosition();
    handleCurrentPositionInPositionsViewer();

    // Hide the loading screen after some seconds
    setTimeout(() => {
      background.style.filter = 'none';
      loadingScreen.style.opacity = '0';

      // We wait until the opacity transition of the loading screen is finished
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 200);
    }, 1500);
  }
};