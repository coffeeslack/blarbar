import React from "react";
import "./css/App.css";
import AppRouter from "./routes/AppRouter";
import uuid from "uuid";
import fb from "./config/firebase";
import firebase from "firebase/app";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      isLoading: false
    };
  }

  componentDidMount() {
    this.authListener();
    if (this.state.user) {
      this.checkData();
    }
  }

  authListener() {
    fb.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  logOut = () => {
    fb.auth().signOut();
    this.setState(prevState => ({
      user: {},
      isLoading: false,
      drags: [],
      following: [],
      followers: [],
      notifications: [],
      newNotifications: [],
      clickedDrags: []
    }));

    localStorage.clear("userDetails");
    localStorage.clear("clickedDrags");
  };

  checkData = () => {
    firebase
      .firestore()
      .collection("users")
      .get()
      .then(data => {
        const userDetails = localStorage.getItem("userDetails");
        if (userDetails) {
          const parsedState = JSON.parse(userDetails);
          this.setState(parsedState);
        } else {
          data.forEach(doc => {
            if (doc.data().id === this.state.user.uid) {
              this.setState(prevState => ({
                ...prevState,
                ...doc.data()
              }));
              const setUserDetails = JSON.stringify(this.state);
              localStorage.setItem("userDetails", setUserDetails);
            }
          });
        }

        const clickedDrags = localStorage.getItem("clickedDrags");
        if (clickedDrags) {
          const parsedState = JSON.parse(clickedDrags);
          this.setState(prevState => ({
            ...prevState,
            clickedDrags: parsedState
          }));
        } else {
          this.checkClickedDrags();
        }
        this.checkDrag();
        this.checkNotifications();
      })
      .catch(error => {
        console.log(error);
      });
  };

  checkDrag = () => {
    firebase
      .firestore()
      .collection("drags")
      .get()
      .then(data => {
        const mainDrags = [];
        data.forEach(doc => {
          if (doc.data().for === this.state.user.uid) {
            mainDrags.push({ ...doc.data(), savedDrag: false });
          }
          this.state.following &&
            this.state.following.map(user => {
              if (doc.data().for === user.userId) {
                mainDrags.push({ ...doc.data(), savedDrag: false });
              }
            });
        });
        this.state.clickedDrags &&
          mainDrags.map(drag => {
            this.state.clickedDrags.map(clickedDrag => {
              if (clickedDrag.dragId === drag.id) {
                drag.selectedDrag = clickedDrag.selectedDrag;
              }
              return clickedDrag;
            });
            return drag;
          });
        mainDrags.sort(function(a, b) {
          return a.createdAt > b.createdAt ? -1 : 1;
        });
        this.setState(prevState => ({
          ...prevState,
          drags: mainDrags
        }));
        this.checkComments();
      })
      .catch(error => {
        console.log(error);
      });
  };

  checkAllDrags = () => {
    this.checkClickedDrags();
    firebase
      .firestore()
      .collection("drags")
      .get()
      .then(data => {
        const allDrags = [];
        data.forEach(doc => {
          allDrags.push({ ...doc.data(), savedDrag: false });
        });
        this.state.clickedDrags &&
          allDrags.map(drag => {
            this.state.clickedDrags.map(clickedDrag => {
              if (clickedDrag.dragId === drag.id) {
                drag.selectedDrag = clickedDrag.selectedDrag;
              }
              return clickedDrag;
            });
            return drag;
          });
        allDrags.sort(function(a, b) {
          return a.createdAt > b.createdAt ? -1 : 1;
        });
        this.setState(prevState => ({
          ...prevState,
          allDrags: allDrags
        }));
        firebase
          .firestore()
          .collection("comments")
          .get()
          .then(data => {
            this.setState(prevState => {
              return {
                ...prevState,
                allDrags: prevState.allDrags.map(drag => {
                  let dragComments = [];
                  data.forEach(doc => {
                    if (doc.data().for === drag.id) {
                      dragComments.push(doc.data());
                    }
                  });
                  return { ...drag, comments: dragComments };
                })
              };
            });
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  };

  checkSavedDrags = () => {
    this.checkClickedDrags();
    this.setState(prevState => ({
      ...prevState,
      savedDrags: []
    }));
    firebase
      .firestore()
      .collection("savedDrags")
      .get()
      .then(doc => {
        let savedDrags = [];
        doc.forEach(savedDrag => {
          if (savedDrag.data().userId === this.state.id) {
            firebase
              .firestore()
              .collection("drags")
              .doc(`${savedDrag.data().dragId}`)
              .get()
              .then(doc => {
                savedDrags.push({ ...doc.data(), savedDrag: true });
                this.state.clickedDrags &&
                  savedDrags.map(drag => {
                    this.state.clickedDrags.map(clickedDrag => {
                      if (clickedDrag.dragId === drag.id) {
                        drag.selectedDrag = clickedDrag.selectedDrag;
                      }
                      return clickedDrag;
                    });
                    return drag;
                  });
                this.setState(prevState => ({
                  ...prevState,
                  drags: prevState.drags.concat(savedDrags),
                  savedDrags: savedDrags
                }));
              })
              .catch(error => {
                console.log(error);
              });
          }
        });
      })
      .catch(error => console.log(error));
  };

  checkClickedDrags = () => {
    firebase
      .firestore()
      .collection("clickedDrags")
      .get()
      .then(data => {
        let clickedDrags = [];
        data.forEach(doc => {
          if (doc.data().userId === this.state.user.uid) {
            clickedDrags.push(doc.data());
            this.setState(prevState => ({
              ...prevState,
              clickedDrags: clickedDrags
            }));

            const clickedDragState = JSON.stringify(this.state.clickedDrags);
            localStorage.setItem("clickedDrags", clickedDragState);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  checkComments = () => {
    firebase
      .firestore()
      .collection("comments")
      .get()
      .then(data => {
        this.setState(prevState => {
          return {
            ...prevState,
            drags: prevState.drags.map(drag => {
              let dragComments = [];
              data.forEach(doc => {
                if (doc.data().for === drag.id) {
                  dragComments.push(doc.data());
                }
              });
              return { ...drag, comments: dragComments };
            })
          };
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
  checkFollowing = () => {
    firebase
      .firestore()
      .collection("drags")
      .get()
      .then(data => {
        const followingDrags = [];
        data.forEach(doc => {
          this.state.following.map(user => {
            if (doc.data().for === user.userId) {
              followingDrags.push(doc.data());
            }
          });
        });
        this.state.clickedDrags &&
          followingDrags.map(drag => {
            this.state.clickedDrags.map(clickedDrag => {
              if (clickedDrag.dragId === drag.id) {
                drag.selectedDrag = clickedDrag.selectedDrag;
              }
              return clickedDrag;
            });
            return drag;
          });
        followingDrags.sort(function(a, b) {
          return a.createdAt > b.createdAt ? -1 : 1;
        });
        this.setState(
          prevState => ({
            ...prevState,
            drags: prevState.drags.concat(followingDrags)
          }),
          () => {
            this.state.drags.sort(function(a, b) {
              return a.createdAt > b.createdAt ? -1 : 1;
            });
          }
        );

        this.checkComments();
      })
      .catch(error => {
        console.log(error);
      });
  };

  checkNotifications = () => {
    this.setState(prevState => ({
      ...prevState,
      notifications: [],
      newNotifications: []
    }));
    firebase
      .firestore()
      .collection("notifications")
      .get()
      .then(data => {
        let notifications = [];
        data.forEach(doc => {
          if (doc.data().to === this.state.id) {
            notifications.push(doc.data());
          }
          if (doc.data().to === this.state.id && !doc.data().viewed) {
            // console.log(doc.data().text);
            this.setState(prevState => ({
              ...prevState,
              newNotifications: [...prevState.newNotifications, doc.data()]
            }));
          }
        });
        notifications.sort(function(a, b) {
          return a.createdAt > b.createdAt ? -1 : 1;
        });
        this.setState(prevState => ({
          ...prevState,
          notifications: notifications
        }));
      })
      .catch(error => {
        console.log(error);
      });
  };

  checkNewNotifications = () => {
    this.setState(prevState => ({
      ...prevState,
      newNotifications: []
    }));
    firebase
      .firestore()
      .collection("notifications")
      .get()
      .then(data => {
        data.forEach(doc => {
          if (doc.data().to === this.state.id && !doc.data().viewed) {
            // console.log(doc.data().text);
            this.setState(prevState => ({
              ...prevState,
              newNotifications: [...prevState.newNotifications, doc.data()]
            }));
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  onDrag = e => {
    const value = e.target.value;
    const id = e.target.className;
    if (value === "leftDrag") {
      this.setState(prevState => ({
        ...prevState,
        drags: prevState.drags.map(drag => {
          let clickedDrag = prevState.clickedDrags
            ? prevState.clickedDrags.filter(
                clickedDrag => clickedDrag.dragId === id
              )
            : [];
          if (
            drag.id === id &&
            clickedDrag.length === 0 &&
            drag.userHasDragged === false
          ) {
            firebase
              .firestore()
              .collection("drags")
              .doc(`${id}`)
              .update({
                "leftDrag.drags": firebase.firestore.FieldValue.increment(1)
              })
              .then()
              .catch(error => {
                console.log(error);
              });
            firebase
              .firestore()
              .collection("clickedDrags")
              .add({
                dragId: drag.id,
                userId: this.state.user.uid,
                selectedDrag: "leftDrag"
              })
              .then(this.checkClickedDrags())
              .catch(error => {
                console.log(error);
              });
            return {
              ...drag,
              selectedDrag: "leftDrag",
              leftDrag: {
                ...drag.leftDrag,
                drags: drag.leftDrag.drags + 1,
                userHasDragged: true
              }
            };
          } else {
            return { ...drag };
          }
        })
      }));
    }
    if (value === "rightDrag") {
      this.setState(prevState => ({
        ...prevState,
        drags: prevState.drags.map(drag => {
          let clickedDrag = prevState.clickedDrags
            ? prevState.clickedDrags.filter(
                clickedDrag => clickedDrag.dragId === id
              )
            : [];
          if (
            drag.id === id &&
            clickedDrag.length === 0 &&
            !drag.userHasDragged
          ) {
            firebase
              .firestore()
              .collection("drags")
              .doc(`${id}`)
              .update({
                "rightDrag.drags": firebase.firestore.FieldValue.increment(1)
              })
              .then()
              .catch(error => {
                console.log(error);
              });
            firebase
              .firestore()
              .collection("clickedDrags")
              .add({
                dragId: drag.id,
                userId: this.state.user.uid,
                selectedDrag: "rightDrag"
              })
              .then(this.checkClickedDrags())
              .catch(error => {
                console.log(error);
              });
            return {
              ...drag,
              userHasDragged: true,
              selectedDrag: "rightDrag",
              rightDrag: {
                ...drag.rightDrag,
                drags: drag.rightDrag.drags + 1
              }
            };
          } else {
            return { ...drag };
          }
        })
      }));
    }
  };

  onComment = e => {
    e.preventDefault();
    const { value, id } = e.target.comment;

    const newComment = {
      for: id,
      text: value,
      id: uuid(),
      userName: this.state.userName,
      profilePic: this.state.profilePic,
      createdAt: new Date()
    };
    firebase
      .firestore()
      .collection("comments")
      .doc(`${newComment.id}`)
      .set(newComment)
      .then(this.checkComments())
      .catch(error => {
        console.log(error);
      });

    this.setState(prevState => ({
      ...prevState,
      drags: prevState.drags.map(drag => {
        if (drag.id === id && value !== "") {
          return {
            ...drag,
            comments: [...drag.comments, newComment]
          };
        } else {
          return { ...drag };
        }
      })
    }));

    e.target.comment.value = "";
  };

  onCreate = drag => {
    const newDrag = { ...drag, savedDrag: false };
    this.setState(prevState => ({
      ...prevState,
      drags: [newDrag, ...prevState.drags]
    }));
  };

  onDelete = id => {
    this.setState(prevState => ({
      ...prevState,
      drags: prevState.drags.filter(drag => drag.id != id),
      allDrags: prevState.allDrags.filter(drag => drag.id != id)
    }));
  };

  checkUserDetails = () => {
    firebase
      .firestore()
      .collection("users")
      .get()
      .then(data => {
        data.forEach(doc => {
          if (doc.data().id === this.state.user.uid) {
            this.setState(prevState => ({
              ...prevState,
              ...doc.data()
            }));
            const setUserDetails = JSON.stringify({
              ...this.state,
              drags: [],
              allDrags: []
            });
            localStorage.setItem("userDetails", setUserDetails);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <div>
          <AppRouter
            {...this.state}
            handleLogOut={this.logOut}
            handleDrag={this.onDrag}
            handleComment={this.onComment}
            handleReply={this.onReply}
            handleReplyStatus={this.changeReplyStatus}
            handleCancelReply={this.cancelReply}
            checkNotifications={this.checkNewNotifications}
            handleCreate={this.onCreate}
            handleDelete={this.onDelete}
            handleClickedDrags={() => {
              this.checkDrag();
              this.checkComments();
              this.checkClickedDrags();
            }}
            handleDataCheck={() => {
              this.checkData();
            }}
            checkAllDrags={this.checkAllDrags}
            checkUserDetails={this.checkUserDetails}
          />
        </div>
      </div>
    );
  }
}

export default App;
