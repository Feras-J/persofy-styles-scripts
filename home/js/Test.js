

////<!--GOOGLE MAPS INI-->
//script
// Initialize map function
    function initMap() {
        const mapOptions = {
            center: { lat: 37.7749, lng: -122.4194 },
            zoom: 11,
            disableDefaultUI: true,
        };

        const mapElement = document.getElementById("map-container");

        // Check if map container is available
        if (mapElement) {
            const map = new google.maps.Map(mapElement, mapOptions);
            const transitLayer = new google.maps.TransitLayer();
            transitLayer.setMap(map);

            new google.maps.Marker({
                position: { lat: 37.7749, lng: -122.4194 },
                map: map,
                title: "San Francisco",
            });
        } else {
            console.error("Map container not found");
        }
    }
            // Delay initMap execution until all resources are loaded
            window.onload = function () {
        initMap();
    };
    
    
    
    
    //hide the google logo
    document.addEventListener("DOMContentLoaded", function() {
      function hideAttribution() {
        const element1 = document.querySelector("#map-container > div > div.gm-style > div:nth-child(16) > div");
        const element2 = document.querySelector("#map-container > div > div.gm-style > div:nth-child(14) > div");
        
        if (element1) {
          element1.style.display = "none";
        }
        
        if (element2) {
          element2.style.display = "none";
        }
    
        // Stop checking once both elements are found and hidden
        if (element1 && element2) {
          clearInterval(interval);
        }
      }
    
      // Set an interval to check for the elements after Google Maps has loaded
      const interval = setInterval(hideAttribution, 500);
    });
    
    
// /script

//script
    var app = new Vue({
    el: '#mockup-generator-navigation',
      mounted() {
        const nav = document.querySelectorAll('#mockup-generator-navigation a');
        let url = window.location.pathname;
        for (let i = 0; i < nav.length; i++) {
          var current = url.match(nav[i].classList[0])
          if(current !== null){
            nav[i].classList.add('active');
          }
        } 
      },
    });
  
  // /script


  
//<!--//new Vue-->
//script
  const generalMixin = {
      data: {
          dpSrc: null,
          postSrc: [],
          copied: false // Moved `copied` to the data object since it’s referenced in `copyImage`
      },
      methods: {
          downloadPng(target, name) {
              if (this.showUnlockPopup()) {
                  return;
              }
              const preview = document.getElementById(target);
              html2canvas(preview)
                  .then(canvas => {
                      const link = document.createElement('a');
                      link.download = `${name}.png`;
                      link.href = canvas.toDataURL();
                      link.click();
                  });
          },
          copyImage(target) {
              const preview = document.getElementById(target);
              navigator.permissions.query({ name: "clipboard-write" }).then(result => {
                  if (result.state === "granted" || result.state === "prompt") {
                      html2canvas(preview).then(canvas => 
                          canvas.toBlob(blob => 
                              navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
                          )
                      );
                      this.data.copied = true;
                  }
              });
          },
          numberInput(e, inputName) {
              const SI_SYMBOL = ["", "k", "M", "B", "T", "P", "E"];
              this.data[inputName] = this.methods.abbreviateNumber(e.target.value, SI_SYMBOL);
          },
          abbreviateNumber(number, SI_SYMBOL) {
              const tier = Math.min(Math.log10(Math.abs(number)) / 3 | 0, 6);
              if (tier === 0) return number;
              const suffix = SI_SYMBOL[tier];
              const scale = Math.pow(10, tier * 3);
              const scaled = number / scale;
              return scaled.toFixed(1) + suffix;
          },
          checkIfNumber(event) {
              const regex = /(^[0-9]*$)|(Backspace|Tab|Delete|ArrowLeft|ArrowRight)/;
              if (!regex.test(event.key)) {
                  event.preventDefault();
              }
          },
          showUnlockPopup() {
              // Add implementation here or remove this check if not needed.
              return false;
          }
      }
  };

  // Example usage:
  // generalMixin.methods.downloadPng("targetElementId", "downloadName");
  // Call methods directly as needed.
// /script

  
  

//<!-- uploading the photos NEW VUE-->
//script
  const uploadMixin = {
      data: {
          dpSrc: null,
          postSrc: []
      },
      methods: {
          uploadImage(fileset, location, index) {
              const files = Array.from(fileset);
              files.forEach(file => {
                  const src = URL.createObjectURL(file);
                  if (location === 'header') {
                      this.data.dpSrc = src;
                  } else {
                      if (index >= 0) {
                          const posts = [...this.data.postSrc];
                          posts[index] = src;
                          this.data.postSrc = [...posts];
                      } else {
                          this.data.postSrc.push(src);
                      }
                  }
              });
          },
          deletePost(post) {
              this.data.postSrc = this.data.postSrc.filter(e => e !== post);
          },
          validation(e) {
              console.log(e);
          }
      }
  };

  // Example usage:
  // uploadMixin.methods.uploadImage(fileInput.files, 'header', -1);
  // Call methods directly as needed.
// /script


//<!-- adding the text -->
//script
  const captionMixin = {
      data: {
          caption: '',
          text: 'This is caption that will display on the final mockup. You can write anything.',
          displayCaptionValue: 'This is caption that will display on the final mockup. You can write anything.',
          captionValue: '',
          showSeeMore: false,
          count: 0
      },
      methods: {
          addCaption(e, charLimit, platform) {
              if (this.data.caption.length < charLimit || e.target.selectionStart < charLimit) {
                  this.methods.setDisplayCaptionValue.call(this, charLimit, platform);
                  if (this.data.displayCaptionValue === ' ') {
                      this.data.captionValue = '';
                  }
                  if (this.data.caption.length > charLimit) {
                      this.methods.setCaptionValue.call(this, platform);
                      console.log({ val: this.data.captionValue, dis: this.data.displayCaptionValue });
                  }
              } else {
                  if (
                      this.data.displayCaptionValue === ' ' ||
                      this.data.displayCaptionValue === this.data.text ||
                      this.data.displayCaptionValue.length < charLimit
                  ) {
                      this.methods.setDisplayCaptionValue.call(this, charLimit, platform);
                  }
                  this.data.count = 0;
                  this.methods.setCaptionValue.call(this, platform);
              }
          },
          styleCaption(words, target, platform) {
              let displaySentence = '';
              words.forEach((word, i) => {
                  if (word.startsWith('@') || word.startsWith('#')) {
                      words[i] = `<span style="color:${platform === 'Tiktok' ? '#FFFFFF' : '#1876F2'}">${word}</span>`;
                  }
                  displaySentence += ' ' + words[i];
                  this.data[target] = displaySentence;
              });
          },
          setDisplayCaptionValue(charLimit, platform) {
              const firstHalf = this.data.caption.slice(0, charLimit);
              const words = firstHalf.split(' ');
              this.methods.styleCaption.call(this, words, 'displayCaptionValue', platform);
              this.data.showSeeMore = this.data.caption.length >= charLimit;
              this.data.count = this.data.captionValue === ' ' ? 1 : 0;
          },
          setCaptionValue(platform) {
              const words = this.data.caption.split(' ');
              this.methods.styleCaption.call(this, words, 'captionValue', platform);
              this.data.showSeeMore = true;
          },
          seeMoreExpand() {
              this.data.count = 1;
              this.data.showSeeMore = false;
          }
      }
  };

  // Example usage:
  // captionMixin.methods.addCaption(event, charLimit, platform);
  // Call methods directly as needed.
// /script



//<!--glide Components NEW -->
//script
  // Initialize the Glide slider with configuration options
  const glide = new Glide('.glide', {
      type: 'slider',
      perView: 4,
      focus: "center",
      rewind: false,
      bound: true,
      gap: 0,
      breakpoints: {
          1200: { perView: 4 },
          1080: { perView: 3 },
          1198: { perView: 3 },
          768: { perView: 3 },
          700: { perView: 3 },
          600: { perView: 2 },
          576: { perView: 2 },
          400: { perView: 1 }
      }
  }).mount();

  // Function to handle disabling/enabling control buttons based on current slide index
  function handleDisableControls() {
      const backBtnEl = document.querySelector('[data-glide-dir="<"]');
      const nextBtnEl = document.querySelector('[data-glide-dir=">"]');
      
      if (backBtnEl && nextBtnEl) {
          // Disable the back button if on the first slide
          if (glide.index === 0) {
              backBtnEl.classList.add('--disabled');
          } else {
              backBtnEl.classList.remove('--disabled');
          }

          // Disable the next button if on the last slide
          if (glide.index + glide.settings.perView >= glide._c.Html.slides.length) {
              nextBtnEl.classList.add('--disabled');
          } else {
              nextBtnEl.classList.remove('--disabled');
          }
      }
  }

  // Attach the control handling function to Glide events
  glide.on(['build.after', 'run'], function () {
      handleDisableControls();
  });

  // Initial call to handle controls after mounting
  handleDisableControls();
// /script






//<!----old-->
//script
  (function (document, head, window) {
      var gist = window.gist = window.gist || [];
      
      gist.methods = ['trackPageView', 'identify', 'track', 'setAppId'];
      gist.factory = function (method) {
          return function () {
              var args = Array.prototype.slice.call(arguments);
              args.unshift(method);
              gist.push(args);
              return gist;
          };
      };

      for (var i = 0; i < gist.methods.length; i++) {
          var method = gist.methods[i];
          gist[method] = gist.factory(method);
      }

      var script = document.createElement('script');
      script.src = "https://widget.getgist.com";
      script.async = true;

      var firstScript = document.getElementsByTagName(head)[0];
      firstScript.appendChild(script);

      script.addEventListener('load', function () {
          // Callback after script loads (optional, empty here)
      }, false);

      gist.setAppId("vh6e94bm");
      gist.trackPageView();
  })(document, 'head', window);
// /script













//script


//for the mockup download
// document.getElementById("downloadButton").addEventListener("click", function () {
//   // Wait for a short delay to make sure all elements are rendered and loaded
//   setTimeout(() => {
//     const targetElementId = "linkedin-mockup-preview";
//     const element = document.getElementById(targetElementId);
//     if (element) {
//       html2canvas(element, {
//         useCORS: true,
//         scale: 2,
//         windowWidth: document.body.scrollWidth,
//         windowHeight: document.body.scrollHeight
//       }).then((canvas) => {
//         const link = document.createElement('a');
//         link.download = 'linkedin-ad-mockup.png'; // Set download file name
//         link.href = canvas.toDataURL(); // Get PNG data URL from the canvas
//         link.click(); // Trigger download
//       }).catch((error) => {
//         console.error("Error capturing element for download: ", error);
//       });
//     } else {
//       console.error(`Element with ID '${targetElementId}' not found.`);
//     }
//   }, 500); // Adjust the delay if needed
// });


document.getElementById("downloadButtonGM").addEventListener("click", function () {
  downloadMockup("google-mockup-preview");
});

document.getElementById("downloadButtonLI").addEventListener("click", function () {
  downloadMockup("linkedin-mockup-preview");
});

document.getElementById("downloadButtonFB").addEventListener("click", function () {
  downloadMockup("facebook-mockup-preview");
});

document.getElementById("downloadButtonIG").addEventListener("click", function () {
  downloadMockup("instagram-mockup-preview");
});

function downloadMockup(targetElementId) {
    const element = document.getElementById(targetElementId);

    if (!element) {
        alert(`Element with ID '${targetElementId}' not found.`);
        return;
    }

    setTimeout(() => {
        html2canvas(element, {
            useCORS: true, // Enable cross-origin handling
            scale: 2,      // High-resolution image capture
            allowTaint: false, // Avoid any tainting-related issues
            onclone: (clonedDocument) => {
                // This ensures the styles applied in the original are respected in the clone
                const clonedElement = clonedDocument.getElementById(targetElementId);
                clonedElement.style.display = 'block';
            },
        }).then((canvas) => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL("image/png");
            link.download = `${targetElementId}-mockup.png`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch((error) => {
            alert("Error capturing element for download: " + error.message);
        });
    }, 500);
}

//--------for the photo-upload---------------------------------

function handleFileUpload(event, wrapperId, borderRadius = '50%') {
  const file = event.target.files[0];
  
  if (!file) {
    console.error("No file selected");
    return;
  }

  if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/svg+xml") {
    alert("Please upload a valid image file (JPG, PNG, SVG).");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    const profileWrapper = document.getElementById(wrapperId);
    if (profileWrapper) {
      profileWrapper.innerHTML = ''; // Clear previous content
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = 'Uploaded Image';
      img.style.maxWidth = '100%';
      img.style.height = '100%';
      img.style.borderRadius = borderRadius; // Set dynamic border radius
      
      profileWrapper.appendChild(img);
    } else {
      console.error(`Element with ID "${wrapperId}" not found.`);
    }
  };

  reader.readAsDataURL(file);
}

document.getElementById('fileInputLI').addEventListener('change', function(event) {
  handleFileUpload(event, 'profile-picture-wrapper-LI','0%');
});

document.getElementById('fileInputFB').addEventListener('change', function(event) {
    handleFileUpload(event, 'profile-picture-wrapper-FB');
  });

document.getElementById('fileInputIG').addEventListener('change', function(event) {
  handleFileUpload(event, 'profile-picture-wrapper-IG');
});

//------------------------//
document.getElementById('postFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/svg+xml")) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const postBody = document.getElementById('post-body-FB');

            if (postBody) {
                postBody.innerHTML = ''; // Clear previous content
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Uploaded Post Image';
                img.style.maxWidth = '100%'; // Maintain aspect ratio
                img.style.height = 'auto';  // Automatic height adjustment
                img.style.objectFit = 'cover'; // Optional, makes sure it fits its container
                img.style.borderRadius = '5px'; // To match rounded container

                postBody.appendChild(img);
            } else {
                console.error('Element with ID "post-body-FB" not found.');
            }
        };

        reader.readAsDataURL(file);
    } else {
        alert('Please upload a valid image file (JPG, PNG, SVG).');
    }
});

document.getElementById('postFileInputIG').addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/svg+xml")) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const postBody = document.getElementById('post-body-IG');

            if (postBody) {
                postBody.innerHTML = ''; // Clear previous content
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Uploaded Post Image';
                img.style.maxWidth = '100%'; // Maintain aspect ratio
                img.style.height = 'auto';  // Automatic height adjustment
                img.style.objectFit = 'cover'; // Optional, makes sure it fits its container
                img.style.borderRadius = '5px'; // To match rounded container

                postBody.appendChild(img);
            } else {
                console.error('Element with ID "post-body-FB" not found.');
            }
        };

        reader.readAsDataURL(file);
    } else {
        alert('Please upload a valid image file (JPG, PNG, SVG).');
    }
});



document.getElementById('postFileInputLI').addEventListener('change',function(event) {
	    const file = event.target.files[0];

    if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/svg+xml")) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const postBody = document.getElementById('post-body-LI');

            if (postBody) {
                postBody.innerHTML = ''; // Clear previous content
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Uploaded Post Image';
                img.style.maxWidth = '100%'; // Maintain aspect ratio
                img.style.height = 'auto';  // Automatic height adjustment
                img.style.objectFit = 'cover'; // Optional, makes sure it fits its container
                img.style.borderRadius = '5px'; // To match rounded container

                postBody.appendChild(img);
            } else {
                console.error('Element with ID "post-body-FB" not found.');
            }
        };

        reader.readAsDataURL(file);
    } else {
        alert('Please upload a valid image file (JPG, PNG, SVG).');
    }
});

//---------------------------------------------------------//


// /script//<!--NEW SCRIPT DOWNLOAD-->


//<!--NEW SCRIPTS-->
//script





//for the emotions
document.addEventListener('DOMContentLoaded', function () {
    // Define the container where reactions should appear
    const reactEmoticonContainer = document.getElementById('react-emoticon');

    // Define an array of reactions you want to display initially
    const initialReactions = ['linkedin-light', 'linkedin-hmm']; // Adjust based on your requirements

    // Define the base URL for the hosted SVGs
    const baseUrl = "https://feras-j.github.io/persofy/";

    // Add initial reactions to the container
    initialReactions.forEach((reaction) => {
        // Set the file names based on the reaction type
        const reactionMap = {
            "linkedin-hmm": "linkedin-hmm.svg",
            "linkedin-light": "linkedin-light.svg",
        };

        // Select the appropriate SVG file based on the reaction type
        const imgSrc = `${baseUrl}${reactionMap[reaction] || "default-icon.svg"}`; // default fallback if needed

        // Create the <img> element and set attributes
        const imgElement = document.createElement('img');
        imgElement.src = imgSrc;
        imgElement.setAttribute('data-reaction', reaction);
        imgElement.style.marginLeft = '-5px'; // Overlap each reaction slightly

        console.log('Appending the following IMG from initial reactions:', imgElement); // Proper logging
        reactEmoticonContainer.appendChild(imgElement);
    });

    // Handle the popup for adding reactions
    const reactEmoticon = document.getElementById('react-emoticon');
    const reactionsPopup = document.getElementById('reactions-popup');

    // Remove the old close button if it exists
    const oldCloseButton = document.getElementById('close-popup-button');
    if (oldCloseButton) {
        oldCloseButton.remove();
    }

    // Create a new close button dynamically and style it
    const closePopupButton = document.createElement('button');
    closePopupButton.id = 'close-popup-button';
    closePopupButton.innerHTML = '&#10006;'; // Unicode for 'X'
    closePopupButton.style.position = 'absolute';
    closePopupButton.style.top = '10px';
    closePopupButton.style.right = '10px';
    closePopupButton.style.cursor = 'pointer';
    closePopupButton.style.fontSize = '14px';
    closePopupButton.style.color = '#333';
    closePopupButton.style.padding = '8px';
    closePopupButton.style.border = 'none';
    closePopupButton.style.borderRadius = '50%';
    closePopupButton.style.backgroundColor = '#ffffff'; // Set background to white
    closePopupButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
    closePopupButton.style.width = '30px'; // Set the button width
    closePopupButton.style.height = '30px'; // Set the button height
    closePopupButton.style.display = 'flex';
    closePopupButton.style.alignItems = 'center';
    closePopupButton.style.justifyContent = 'center';
    closePopupButton.style.transition = 'background-color 0.3s, transform 0.2s';
    
    // Add hover effect
    closePopupButton.addEventListener('mouseover', function () {
        closePopupButton.style.backgroundColor = '#f0f0f0';
        closePopupButton.style.transform = 'scale(1.1)';
    });
    closePopupButton.addEventListener('mouseout', function () {
        closePopupButton.style.backgroundColor = '#ffffff';
        closePopupButton.style.transform = 'scale(1)';
    });
    
    reactionsPopup.appendChild(closePopupButton);

    // Add click event to open the reactions popup
    reactEmoticon.addEventListener('click', function () {
        reactionsPopup.style.display = 'flex'; // Use flex to maintain horizontal layout
        reactionsPopup.style.flexDirection = 'row'; // Ensure items are displayed in a row
        reactionsPopup.style.left = '10px'; // Align further to the left of the screen
        reactionsPopup.style.top = '50%'; // Position in the middle vertically
        reactionsPopup.style.transform = 'translateY(-50%)'; // Adjust to center the popup vertically
        reactionsPopup.style.width = '350px'; // Make the popup wider
        reactionsPopup.style.padding = '15px'; // Increase padding for a better look
        reactionsPopup.style.border = '1px solid #ccc'; // Set a larger border
        reactionsPopup.style.fontSize = '12px'; // Increase font size for everything inside
        reactionsPopup.style.position = 'absolute';
        reactionsPopup.style.backgroundColor = '#fff';
        reactionsPopup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; // Add a subtle shadow for a nice look
    });

    // Add click event to close the popup
    closePopupButton.addEventListener('click', function () {
        reactionsPopup.style.display = 'none';
    });

    // Add emotion to container on click for reactions
    document.querySelectorAll('#reactions-list .reaction-item').forEach((item) => {
        item.addEventListener('click', function () {
            const reaction = item.dataset.reaction;
            const existingReaction = reactEmoticonContainer.querySelector(`[data-reaction="${reaction}"]`);

            if (existingReaction) {
                // If the reaction already exists, remove it
                console.log('Removing the following IMG:', existingReaction);
                reactEmoticonContainer.removeChild(existingReaction);
            } else {
                // If the reaction does not exist, add it
                // Define the base URL for the hosted SVGs
                const baseUrl = "https://feras-j.github.io/persofy/";

                // Set the file names based on the reaction type
                const reactionMap = {
                    "linkedin-hmm": "linkedin-hmm.svg",
                    "linkedin-clap": "linkedin-clap.svg",
                    "linkedin-heart": "linkedin-heart.svg",
                    "linkedin-like": "linkedin-like.svg",
                    "linkedin-light": "linkedin-light.svg",
                };

                // Select the appropriate SVG file based on the reaction type
                const imgSrc = `${baseUrl}${reactionMap[reaction] || "default-icon.svg"}`; // default fallback if needed

                // Create the <img> element and set attributes
                const imgElement = document.createElement('img');
                imgElement.src = imgSrc;
                imgElement.setAttribute('data-reaction', reaction);
                imgElement.style.marginLeft = '-5px'; // Overlap each reaction slightly

                console.log('Appending the following IMG from popup:', imgElement);
                reactEmoticonContainer.appendChild(imgElement);
            }
            reactionsPopup.style.display = 'none'; // Close the popup after selecting a reaction
        });
    });

});

//for facebook EMOTIONS
document.addEventListener('DOMContentLoaded', function () {
  const reactEmoticonContainer = document.getElementById('react-emoticonFB');
  const maxReactions = 4; // Set maximum number of reactions allowed
  const initialReactions = ['Facebook-like', 'Facebook-heart']; // Adjust based on your requirements

  initialReactions.forEach((reaction) => {
      addReaction(reaction);
  });

  const reactionsPopup = document.getElementById('reactions-popup-facebook');

  const oldCloseButton = document.getElementById('close-popup-buttonFB');
  if (oldCloseButton) oldCloseButton.remove();

  const closePopupButton = createCloseButton();
  reactionsPopup.appendChild(closePopupButton);

  reactEmoticonContainer.addEventListener('click', function () {
      openPopup(reactionsPopup);
  });

  closePopupButton.addEventListener('click', function () {
      reactionsPopup.style.display = 'none';
  });

  document.querySelectorAll('#reactions-list-Facebook .reaction-item-Facebook').forEach((item) => {
      item.addEventListener('click', function () {
          const reaction = item.dataset.reaction;
          const existingReaction = reactEmoticonContainer.querySelector(`[data-reaction="${reaction}"]`);

          if (existingReaction) {
              reactEmoticonContainer.removeChild(existingReaction);
          } else {
              if (reactEmoticonContainer.children.length < maxReactions) {
                  addReaction(reaction, item.querySelector('svg'));
              } else {
                  alert('You can only select up to 5 reactions.');
              }
          }
          reactionsPopup.style.display = 'none';
      });
  });

  function addReaction(reaction, svgElement = null) {
    // Define the base URL for the hosted SVGs
    const baseUrl = "https://feras-j.github.io/persofy/Facebook_icons/";

    // Set the file names based on the reaction type
    const reactionMap = {
        "Facebook-Anger":   "facebook-anger.svg",
        "Facebook-like":    "facebook-like.svg",
        "Facebook-heart":   "facebook-heart.svg",
        "Facebook-surprise": "facebook-surprise.svg",
        "Facebook-sad":     "facebook-sad.svg",
        "Facebook-laugh":   "facebook-laugh.svg",
        "Facebook-hug":     "facebook-hug.svg"
    };

    // Select the appropriate SVG file based on the reaction type
    const imgSrc = `${baseUrl}${reactionMap[reaction] || "default-icon.svg"}`; // default fallback if needed

    // Create the <img> element and set attributes
    const imgElement = document.createElement('img');
    imgElement.src = imgSrc;
    imgElement.setAttribute('data-reaction', reaction);
    imgElement.style.marginLeft = '-5px';

    // Append the image to the container
    reactEmoticonContainer.appendChild(imgElement);
}


  function createCloseButton() {
      const closePopupButton = document.createElement('button');
      closePopupButton.id = 'close-popup-button';
      closePopupButton.innerHTML = '&#10006;';
      closePopupButton.style.position = 'absolute';
      closePopupButton.style.top = '10px';
      closePopupButton.style.right = '5px';
      closePopupButton.style.cursor = 'pointer';
      closePopupButton.style.fontSize = '14px';
      closePopupButton.style.color = '#333';
      closePopupButton.style.padding = '8px';
      closePopupButton.style.border = 'none';
      closePopupButton.style.borderRadius = '50%';
      closePopupButton.style.backgroundColor = '#ffffff';
      closePopupButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
      closePopupButton.style.width = '30px';
      closePopupButton.style.height = '30px';
      closePopupButton.style.display = 'flex';
      closePopupButton.style.alignItems = 'center';
      closePopupButton.style.justifyContent = 'center';
      closePopupButton.style.transition = 'background-color 0.3s, transform 0.2s';

      closePopupButton.addEventListener('mouseover', function () {
          closePopupButton.style.backgroundColor = '#f0f0f0';
          closePopupButton.style.transform = 'scale(1.1)';
      });
      closePopupButton.addEventListener('mouseout', function () {
          closePopupButton.style.backgroundColor = '#ffffff';
          closePopupButton.style.transform = 'scale(1)';
      });

      return closePopupButton;
  }

  function openPopup(popup) {
      popup.style.display = 'flex';
      popup.style.flexDirection = 'row';
      popup.style.left = '10px';
      popup.style.top = '50%';
      popup.style.transform = 'translateY(-50%)';
      popup.style.width = '350px';
      popup.style.padding = '15px';
      popup.style.border = '1px solid #ccc';
      popup.style.fontSize = '12px';
      popup.style.position = 'absolute';
      popup.style.backgroundColor = '#fff';
      popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
  }
});




//////////////////////////////////////////




//for the apply option popups LI
document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.getElementById('cta-button');
    const smallPopup = document.getElementById('small-popup');
    const popupItems = document.querySelectorAll('.popup-item');

    // Show/hide the small popup when the CTA button is clicked
    ctaButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the click from bubbling up to the document listener
        const isPopupVisible = smallPopup.style.display === 'block';
        smallPopup.style.display = isPopupVisible ? 'none' : 'block';
    });

    // Event listener for each item in the popup list
    popupItems.forEach(item => {
        item.addEventListener('click', function() {
            const selectedOption = item.getAttribute('data-option');
            ctaButton.textContent = selectedOption; // Update button text with selected option
            smallPopup.style.display = 'none'; // Hide popup after selection
        });
    });

    // Hide popup when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!smallPopup.contains(event.target) && !ctaButton.contains(event.target)) {
            smallPopup.style.display = 'none';
        }
    });
});
//for the apply option popups FB
document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.getElementById('facebook-cta-button');
    const smallPopup = document.getElementById('small-popupFB');
    const popupItems = document.querySelectorAll('.popup-item-FB');

    // Show/hide the small popup when the CTA button is clicked
    ctaButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the click from bubbling up to the document listener
        const isPopupVisible = smallPopup.style.display === 'block';
        smallPopup.style.display = isPopupVisible ? 'none' : 'block';
    });

    // Event listener for each item in the popup list
    popupItems.forEach(item => {
        item.addEventListener('click', function() {
            const selectedOption = item.getAttribute('data-option');
            ctaButton.textContent = selectedOption; // Update button text with selected option
            smallPopup.style.display = 'none'; // Hide popup after selection
        });
    });

    // Hide popup when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!smallPopup.contains(event.target) && !ctaButton.contains(event.target)) {
            smallPopup.style.display = 'none';
        }
    });
});
//for the apply option popups IG
document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.getElementById('instagram-cta-button');
    const smallPopup = document.getElementById('small-popupIG');
    const popupItems = document.querySelectorAll('.popup-item-IG');

    // Show/hide the small popup when the CTA button is clicked
    ctaButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the click from bubbling up to the document listener
        const isPopupVisible = smallPopup.style.display === 'block';
        smallPopup.style.display = isPopupVisible ? 'none' : 'block';
    });

    // Event listener for each item in the popup list
    popupItems.forEach(item => {
        item.addEventListener('click', function() {
            const selectedOption = item.getAttribute('data-option');
            ctaButton.textContent = selectedOption; // Update button text with selected option
            smallPopup.style.display = 'none'; // Hide popup after selection
        });
    });

    // Hide popup when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!smallPopup.contains(event.target) && !ctaButton.contains(event.target)) {
            smallPopup.style.display = 'none';
        }
    });
});






//captions //<!---------------------------------------------------------->
document.addEventListener('DOMContentLoaded', function() {
  // Select all elements with the class 'caption-text'
  const captions = document.querySelectorAll('.caption-text');

  // Loop through each element and add click event listener
  captions.forEach(function(caption) {
      // Initialize captions with placeholders if empty
      if (caption.textContent.trim() === '') {
          caption.textContent = 'Enter Text Here...';
      }

      caption.addEventListener('click', function() {
          // Make the element editable and focus it
          caption.contentEditable = true;
          caption.focus();

          // Select all the text within the element
          selectAllText(caption);

          // Add keydown event to handle "Enter" key
          caption.addEventListener('keydown', function(e) {
              if (e.key === 'Enter') {
                  e.preventDefault();  // Prevent adding a new line
                  caption.blur();  // Trigger blur event to stop editing
              }
          });

          // Listen for blur event to handle saving changes
          caption.addEventListener('blur', function() {
              // Make element non-editable
              caption.contentEditable = false;

              // If the caption is empty, set placeholder text
              if (caption.textContent.trim() === '') {
                  caption.textContent = 'Enter Text Here...';
              } else {
                  // Ensure correct handling of max length and 'See More...'
                  handleMaxLength(caption, 150);
              }
          });

          // Listen for input events to restrict length dynamically
          caption.addEventListener('input', function() {
              if (caption.textContent.length > 150) {
                  caption.textContent = caption.textContent.substring(0, 150);
              }
          });
      });
  });
});

// Function to select all the text in the element
function selectAllText(element) {
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

// Function to handle maximum length and add "See More..."
function handleMaxLength(element, maxLength) {
  if (element.textContent.length > maxLength) {
      // Trim the text to maxLength
      const truncatedText = element.textContent.substring(0, maxLength);

      // Create the 'See More...' element
      const seeMore = document.createElement('strong');
      seeMore.textContent = ' See More...';

      // Set the new content: truncated text + bold 'See More...'
      element.textContent = truncatedText;
      element.appendChild(seeMore);
  }
}

//------------------------------------------------------------------------------




// Call the function to make the number editable





makeEditableNumber('editable-react-sec');

// Make the number in the react section editable on click

function makeEditableNumber(elementId) {
        // Helper function to format numbers with commas
        function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

          
        const element = document.getElementById(elementId);

        element.addEventListener('click', function () {
            if (element.contentEditable !== 'true') {
                element.contentEditable = 'true';
                element.focus();

                // Select all text inside the element
                const range = document.createRange();
                range.selectNodeContents(element);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);


                // Remove editable mode when focus is lost
                element.addEventListener('blur', function () {
                    if (element.innerText.trim() === '') {
                        element.innerText = '1'; // Default to 1 if left empty
                    }

                    let count = parseInt(element.innerText.trim(), 10);
                    if (isNaN(count)) {
                        count = 1; // Set to 1 if parsing fails
                    }

                    // Update the element with formatted number
                    element.innerText = formatNumber(count);

                });

                // Handle keypress events
                element.addEventListener('keydown', function (e) {
                    // Prevent new line (Enter key)
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        element.blur(); // Exit edit mode
                    }
                    // Prevent exceeding the maximum length (3 in this case)
                    if (element.innerText.length >= 7 && e.key.length === 1) {
                        e.preventDefault();
                    }

                });
            }
        });
}

makeEditableNumber('editable-react-sec2');
makeEditableNumber('editable-react-sec3');
makeEditableNumber('editable-react-sec4');
// makeEditableNumber('likes-count-IG');


document.addEventListener('DOMContentLoaded', function () {
    const commentCount = document.getElementById('comment-count');
    const shareCount = document.getElementById('share-count');
    const commentCountFB = document.getElementById('comment-count-FB');
    const shareCountFB = document.getElementById('share-count-FB');
    const LikesIG = document.getElementById('likes-count-IG');
    
    makeEditableWithUpdate(commentCount, 'comment', 'comments', 'comment-label', 5);
    makeEditableWithUpdate(shareCount, 'share', 'shares', 'share-label', 5);

    //for Facebook
    makeEditableWithUpdate(commentCountFB, 'comment', 'comments', 'comment-label-FB', 5);
    makeEditableWithUpdate(shareCountFB, 'share', 'shares', 'share-label-FB', 5);
    //for the Gram
    makeEditableWithUpdate(LikesIG, 'like', 'likes', 'like-label-IG', 5);
    
});


//edit for likes and shares change 
function makeEditableWithUpdate(element, singularLabel, pluralLabel, labelElementId, maxLength) {
    const labelElement = document.getElementById(labelElementId);

    // Helper function to format numbers with commas
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    element.addEventListener('click', function () {
        if (element.contentEditable !== 'true') {
            // Remove formatting to make editing easier
            const rawValue = element.innerText.replace(/,/g, '');
            element.innerText = rawValue;

            element.contentEditable = 'true';
            element.focus();

            // Select all text inside the element
            const range = document.createRange();
            range.selectNodeContents(element);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    });




    // Remove editable mode when focus is lost
    element.addEventListener('blur', function () {
        if (element.innerText.trim() === '') {
            element.innerText = '1'; // Default to 1 if left empty
        }

        let count = parseInt(element.innerText.trim(), 10);
        if (isNaN(count)) {
            count = 1; // Set to 1 if parsing fails
        }

        // Update the element with formatted number
        element.innerText = formatNumber(count);

        // Update the label with singular or plural
        labelElement.innerText = count === 1 ? singularLabel : pluralLabel;

        element.contentEditable = 'false';
    });

    // Handle keypress events
    element.addEventListener('keydown', function (e) {
        // Prevent new line (Enter key)
        if (e.key === 'Enter') {
            e.preventDefault();
            element.blur(); // Exit edit mode
            return;
        }

        // Allow backspace, delete, arrow keys, etc.
        if (e.key.length === 1 && !/^\d$/.test(e.key)) {
            e.preventDefault(); // Only allow numeric input
            return;
        }

        // Prevent exceeding the maximum length
        if (element.innerText.length >= maxLength && e.key.length === 1) {
            e.preventDefault();
        }
    });
}





function makeEditableAndUpdate(elementId, singularLabel, pluralLabel, maxLength) {
    const element = document.getElementById(elementId);
    const labelElement = document.getElementById(elementId === 'comment-count' ? 'comment-label' : 'share-label');

    if (element.contentEditable !== 'true') {
        element.contentEditable = 'true';
        element.focus();

        // Select all text inside the element
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        // Remove editable mode when focus is lost
        element.addEventListener('blur', function () {
            if (element.innerText.trim() === '') {
                element.innerText = '0'; // Default to 0 if left empty
            }

            const count = parseInt(element.innerText.trim(), 10);
            labelElement.innerText = count === 1 ? singularLabel : pluralLabel;

            element.contentEditable = 'false';
        });

        // Handle keypress events
        element.addEventListener('keydown', function (e) {
            // Prevent new line (Enter key)
            if (e.key === 'Enter') {
                e.preventDefault();
                element.blur(); // Exit edit mode
            }

            // Prevent exceeding the maximum length
            if (element.innerText.length >= maxLength && e.key.length === 1) {
                e.preventDefault();
            }
        });
    }
}





function makeEditable(elementId, maxLength) {
    const element = document.getElementById(elementId);

    if (element.contentEditable !== 'true') {
        element.contentEditable = 'true';
        element.focus();

        // Select all text inside the element
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        // Remove editable mode when focus is lost
        element.addEventListener('blur', function () {
            if (element.innerText.trim() === '') {
                element.innerText = 'Enter text here...'; // Default placeholder when empty
            }
            element.contentEditable = 'false';
        });

        // Handle keypress events
        element.addEventListener('keydown', function (e) {
            // Prevent new line (Enter key)
            if (e.key === 'Enter') {
                e.preventDefault();
                element.blur(); // Exit edit mode
            }

            // Prevent exceeding the maximum length
            if (element.innerText.length >= maxLength && e.key.length === 1) {
                e.preventDefault();
            }
        });
    }
}





// Listen for "Enter" key press on the <h4>
  document.getElementById('editable-user-name-IN').addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
          event.preventDefault(); // Prevent line break in editable h4
          updateSpanContent(); // Update the span content
          this.blur(); // Unfocus the h4 after pressing Enter
      }
  });

  // Function to update the <span> content based on the <h4>
  function updateSpanContent() {
      const userNameH4 = document.getElementById('editable-user-name-IN');
      const userNameSpan = document.getElementById('username-span');
      userNameSpan.innerHTML = userNameH4.innerHTML;
  }


  

  
//for the rating number format
  function makeEditableForRating(elementId) {
const element = document.getElementById(elementId);

if (element.contentEditable !== 'true') {
  element.contentEditable = 'true';
  element.focus();

  // Select all text inside the element
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  // Remove editable mode when focus is lost
  element.addEventListener('blur', function () {
    let value = parseFloat(element.innerText);
    if (isNaN(value) || value < 0) {
      value = 0;
    } else if (value > 5) {
      value = 5;
    }
    element.innerText = value.toFixed(1);
    element.contentEditable = 'false';
  });

  // Handle keypress events
  element.addEventListener('keydown', function (e) {
    // Prevent new line (Enter key)
    if (e.key === 'Enter') {
      e.preventDefault();
      element.blur(); // Exit edit mode
    }

    // Allow only valid characters (numbers, dot, and navigation keys)
    if (!/^[0-9.]$/.test(e.key) && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
    }

    // Prevent multiple dots
    if (e.key === '.' && element.innerText.includes('.')) {
      e.preventDefault();
    }

    // Ensure value is between 0.0 and 5.0 after input
    setTimeout(function () {
      let value = parseFloat(element.innerText);
      if (isNaN(value) || value < 0) {
        value = 0;
      } else if (value > 5) {
        value = 5;
      }
      element.innerText = value.toFixed(1);
    }, 0);
  });
}
}




// /script
  







//script // for the search social medi aURLS
  const sections = document.querySelectorAll('.search-section');
  sections.forEach((section) => {
    const content = section.innerHTML;
    section.addEventListener('mouseover', () => {
      sections.forEach((sec) => {
        if (sec !== section) {
          sec.classList.remove('full-width', 'active');
          sec.querySelector('input')?.remove();
          sec.querySelector('.enter-label')?.remove();
          sec.querySelector('.btn-search')?.remove();
          // sec.innerHTML = ` ${sec.innerHTML}`;
        }
      });
  
      section.classList.add('full-width');
  
      if (!section.querySelector('input')) {
        section.textContent = ''; // Clear section for input
  
        // Create input element
        const input = document.createElement('input');
        input.className = 'input';
        input.type = 'text';
        input.placeholder = ' ';
        section.appendChild(input);
  
        // Create label element
        const label = document.createElement('span');
        label.className = 'enter-label';
        label.textContent = 'Profile URL';///////////////////////LABEL
        section.appendChild(label);
  
        // Create search button, hidden initially
        const searchButton = document.createElement('button');
        searchButton.className = 'btn-search';
        searchButton.style.opacity = '0';
        searchButton.style.pointerEvents = 'none';
        searchButton.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path><circle id="svg-circle" cx="208" cy="208" r="144"></circle></svg>
        `;
        section.appendChild(searchButton);
  
        // Animate input and button visibility
        setTimeout(() => {
          input.style.opacity = '1';
          input.style.transform = 'scale(1)';
        }, 100);
  
        input.addEventListener('focus', () => {
          searchButton.style.opacity = '1';
          searchButton.style.pointerEvents = 'auto';
        });
  
        input.addEventListener('blur', () => {
          setTimeout(() => {
            if (!section.classList.contains('active')) {
              searchButton.style.opacity = '0';
              searchButton.style.pointerEvents = 'none';
            }
          }, 100);
        });
      }
    });
  
  
  
  
  
    
    
    
    section.addEventListener('mouseleave', () => {
      if (!section.classList.contains('active') && section.querySelector('input')) {
        section.classList.remove('full-width');
        const input = section.querySelector('input');
        const searchButton = section.querySelector('.btn-search');
        if (input && searchButton) {
          input.style.opacity = '0';
          input.style.transform = 'scale(0.95)';
          searchButton.style.opacity = '0';
          searchButton.style.pointerEvents = 'none';
          setTimeout(() => {
            input.remove();
            searchButton.remove();
            section.innerHTML = content;
          }, 300);
        }
      }
    });
  
    document.addEventListener('click', (event) => {
      if (!section.contains(event.target)) {
        section.classList.remove('active');
        section.querySelector('.enter-label')?.remove();
        section.querySelector('.btn-search')?.remove();
        section.classList.remove('full-width');
        const input = section.querySelector('input');
        const searchButton = section.querySelector('.btn-search');
        if (input && searchButton) {
          input.style.opacity = '0';
          input.style.transform = 'scale(0.95)';
          searchButton.style.opacity = '0';
          searchButton.style.pointerEvents = 'none';
          setTimeout(() => {
            input.remove();
            searchButton.remove();
            section.textContent = content;
          }, 300);
        }
      }
    });
  });
  
  
  // /script










  

//<!--GOOGLE MAPS + GMAPS MU's -->

//<!-- //script
// Initialize map function
function initMap() {
const mapOptions = {
  center: { lat: 37.7749, lng: -122.4194 }, // Coordinates for San Francisco
  zoom: 11, // Closer zoom for a city view
  disableDefaultUI: true,
};
const transitLayer = new google.maps.TransitLayer();
const map = new google.maps.Map(document.getElementById("map-container"), mapOptions);
transitLayer.setMap(map);

// Place a marker at the map's center (San Francisco)
new google.maps.Marker({
  position: { lat: 37.7749, lng: -122.4194 }, // Coordinates for San Francisco
  map: map,
  title: "San Francisco",
});
}
  
  
  
  
  //hide the google logo
  document.addEventListener("DOMContentLoaded", function() {
    function hideAttribution() {
      const element1 = document.querySelector("#map-container > div > div.gm-style > div:nth-child(16) > div");
      const element2 = document.querySelector("#map-container > div > div.gm-style > div:nth-child(14) > div");
      
      if (element1) {
        element1.style.display = "none";
      }
      
      if (element2) {
        element2.style.display = "none";
      }
  
      // Stop checking once both elements are found and hidden
      if (element1 && element2) {
        clearInterval(interval);
      }
    }
  
    // Set an interval to check for the elements after Google Maps has loaded
    const interval = setInterval(hideAttribution, 500);
  });
  
  
// /script -->
  
//<!-- SCRIPT FOR REVIEW STARS -->
//script
  // Select all star-rating containers
  const starContainers = document.querySelectorAll('.star-rating');

  starContainers.forEach(container => {
      // Get all stars within the current container
      const stars = container.querySelectorAll('.star');
      let currentRatingValue = 1; // Default value (1 star is selected)

      // Set click event listeners on each star
      stars.forEach(star => {
          star.addEventListener('click', () => {
              // Get the value of the selected star
              currentRatingValue = parseInt(star.getAttribute('data-value'));

              // Add selected class to all stars up to the clicked one in the current container
              stars.forEach(s => {
                  if (parseInt(s.getAttribute('data-value')) <= currentRatingValue) {
                      s.classList.add('selected');
                      s.classList.remove('empty');
                  } else {
                      s.classList.remove('selected');
                      s.classList.add('empty');
                  }
              });
          });

          star.addEventListener('mouseover', () => {
              // Highlight all stars up to the hovered one without affecting selected stars
              stars.forEach(s => {
                  if (parseInt(s.getAttribute('data-value')) <= parseInt(star.getAttribute('data-value'))) {
                      s.classList.add('hover');
                  } else {
                      s.classList.remove('hover');
                  }
              });
          });
      });

      // Remove hover effect after leaving the rating area for the current container
      container.addEventListener('mouseleave', () => {
          // Remove hover effects and keep the permanent selected stars in place
          stars.forEach(star => {
              star.classList.remove('hover');
          });
      });
  });
// /script

//script//for the inside image edit
  const rectangles = document.querySelectorAll('.shape.rect');

  function uploadImages(index) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.onchange = function(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      rectangles[index].style.backgroundImage = `url(${e.target.result})`;
      rectangles[index].style.backgroundSize = 'cover';  // Ensures the image fills the container
      rectangles[index].style.backgroundPosition = 'center'; // Centers the image
      rectangles[index].classList.add('has-image'); // Add class to show buttons, hide SVG
    };
    reader.readAsDataURL(file);
  };

  input.click();
}


  function deleteImage(event, index) {
    event.stopPropagation(); // Prevent triggering upload on delete click
    rectangles[index].style.backgroundImage = ''; // Clear the image
    rectangles[index].classList.remove('has-image'); // Hide buttons and show SVG
  }

  function triggerEditImage(event, index) {
    event.stopPropagation(); // Prevent triggering upload on edit click
    uploadImages(index); // Re-trigger upload for the specified rectangle
  }





  const base64ImageUrl = 'https://feras-j.github.io/persofy/home/GMPAS_IMG.txt';

  // Fetch the base64 image data
  fetch(base64ImageUrl)
    .then(response => response.text())
    .then(base64Data => {
        // Set the image's href attribute with the fetched data
        const imageElement = document.getElementById('fill-image-render-1041-0');
        imageElement.setAttribute('href', base64Data);
    })
    .catch(error => console.error('Error loading base64 image:', error));
// /script

  
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded.");
  
  const captions = document.querySelectorAll('.caption-text');
  console.log(`Found ${captions.length} captions.`);

  captions.forEach(caption => {
    console.log(`Caption content: ${caption.textContent}`);
    // Perform operations here
  });

  console.log("Script executed successfully.");
});
