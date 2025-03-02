import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

const useFollow = () => {
  const queryClient = useQueryClient()

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`/api/users/follow/${userId}`, {
          method: "POST",
        })
        const data = await res.json()

        if (!res.ok) throw new Errro(data.error || "Something went wrong")
        return data
      } catch (error) {
        throw new Error(error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] })
      queryClient.invalidateQueries({ queryKey: ["authUser"] })
    },
    onError: (error) => {
      toast.error(error)
    },
  })

  return { follow, isPending }
}

export default useFollow
