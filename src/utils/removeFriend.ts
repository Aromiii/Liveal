const removeFriend = async (event: any, id: string) => {
  event.preventDefault();

  const response = await fetch("/api/user/friend", {
    method: "DELETE",
    credentials: "include",
    body: JSON.stringify({
      userId: id
    })
  });
  const body = await response.json();
  alert(body.message);
};

export default removeFriend;