state = {
  displayName: "blarbar",
  userName: "admin_blarbar",
  profilePic: ProfilePic3,
  userIsReplying: false,
  userIsReplyingTo: "",
  userIsReplyingToUserName: "",
  drags: [
    {
      id: "postOne",
      leftDrag: {
        title: "Instagram",
        drags: 120
      },
      rightDrag: {
        title: "Facebook",
        drags: 20
      },
      caption: "Which do you use often?",
      userHasDragged: false,
      selectedDrag: "",
      picture: Pic,
      comments: [
        {
          id: uuid(),
          userName: "shadrackibiso",
          profilePic: ProfilePic2,
          comment: "I love Instagram, its very simple to use"
        },
        {
          id: uuid(),
          userName: "preciousjosiah",
          profilePic: ProfilePic1,
          comment: "I love Facebook"
        }
      ]
    },
    {
      id: "postTwo",
      leftDrag: {
        title: "Games",
        drags: 46
      },
      rightDrag: {
        title: "Movies",
        drags: 90
      },
      caption: "Which do you prefer?",
      userHasDragged: false,
      selectedDrag: "",
      picture: Pic2,
      comments: [
        {
          id: uuid(),
          userName: "just_nathan",
          profilePic: ProfilePic4,
          comment: "who doesn't love movies"
        },
        {
          id: uuid(),
          userName: "shadrackibiso",
          profilePic: ProfilePic2,
          comment: "I love Games"
        },
        {
          id: uuid(),
          userName: "preciousjosiah",
          profilePic: ProfilePic1,
          comment: "I love Movies"
        }
      ]
    },
    {
      id: "postThree",
      leftDrag: {
        title: "3D arts",
        drags: 17622
      },
      rightDrag: {
        title: "2D arts",
        drags: 15662
      },
      caption: "what's your favorite?",
      userHasDragged: false,
      selectedDrag: "",
      picture: Pic1,
      comments: []
    }
  ]
};
