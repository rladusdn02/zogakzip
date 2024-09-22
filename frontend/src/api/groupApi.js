export async function createGroup(groupData){
    const response = await fetch("/api/groups", {
        method: 'POST',
        body: groupData,
    });
    if (!response.ok) {
      throw new Error("그룹 생성에 실패했습니다.");
    }
    const body = await response.json();
    return body;
  }