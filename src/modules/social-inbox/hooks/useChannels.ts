import { useMemo } from "react";
import type { Channel, Platform } from "../types";
import { mockChannels } from "../data";

interface UseChannelsResult {
  channels: Channel[];
  getChannel: (platform: Platform) => Channel | undefined;
  isLoading: boolean;
}

/**
 * Returns all channels for the current store.
 *
 * SWAP POINT: Replace the mock data read below with an RTK Query or fetch call,
 * e.g. `const { data, isLoading } = useGetChannelsQuery()`.
 * The return shape stays identical so no component changes are needed.
 */
export function useChannels(): UseChannelsResult {
  const channels = mockChannels;

  const getChannel = useMemo(
    () => (platform: Platform) => channels.find((ch) => ch.platform === platform),
    [channels]
  );

  return {
    channels,
    getChannel,
    isLoading: false,
  };
}

