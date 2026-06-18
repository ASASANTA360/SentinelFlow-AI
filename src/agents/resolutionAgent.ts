export async function resolutionAgent(
  exception:boolean
){

  if(exception){

    return {
      status:"pending_human_review"
    }

  }

  return {
    status:"resolved"
  }

}