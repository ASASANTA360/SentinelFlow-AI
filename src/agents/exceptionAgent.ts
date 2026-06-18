export async function exceptionAgent(score:number){

  if(score >= 80){

    return {
      exception:true,
      action:"manual_review"
    }

  }

  return {
    exception:false,
    action:"auto_resolution"
  }

}