const addFriend = async (event: any, id: string) => {
  event.preventDefault();

  const response = await fetch("/api/user/friend", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      userId: id
    })
  });
  const body = await response.json();
  alert(body.message);
};

export default addFriend;