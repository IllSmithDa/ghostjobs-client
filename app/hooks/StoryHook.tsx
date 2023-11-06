import { useEffect, useState } from "react";
import { axiosFetch } from "../component/Axios/axios";
import { Story } from "../component/Types";
import ReportForm from "../component/ReportForm/ReportForm";
import Link from "next/link";
import DropDownAll from "../component/DropDownAll/DropDownAll";

export default function useStory() {
  const [storyList, setStoryList] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [offset, setOffset] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(false);
  const limit = 7;
  useEffect(() => {
    // https://blog.logrocket.com/3-ways-implement-infinite-scroll-react/
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosFetch.get(`/api/story/by-date/${offset}/${limit}`)
        if (res.status === 200) {
          // console.log(res.data);
          setOffset(offset => offset + 7);
          if (res.data.stories.length) {
            setStoryList([...storyList, ...res.data.stories])
          } else {
            setReachedEnd(true);
          }
        }
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoading) {
        return;
      }
      if (reachedEnd === false) fetchData();
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);

  useEffect(() => {
    // https://blog.logrocket.com/3-ways-implement-infinite-scroll-react/
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosFetch.get(`/api/story/by-date/${offset}/${limit}`)
        if (res.status === 200) {
          // console.log(res.data);
          setOffset(offset => offset + 7);
          if (res.data.stories.length) {
            setStoryList([...storyList, ...res.data.stories])
          } else {
            setReachedEnd(true);
          }
        }
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return [storyList, isError, isLoading ]
}