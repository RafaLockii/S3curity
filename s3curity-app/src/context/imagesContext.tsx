import { createContext, useContext, ReactNode, Dispatch, SetStateAction, useState } from 'react';

type Image = {
  logo: string;
};

type ImageContextType = {
  image: Image | null;
  setImage: Dispatch<SetStateAction<Image | null>>;
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImageContext must be used within a ImageProvider');
  }
  return context;
};

type ImageProviderProps = {
  children: ReactNode;
};

export const ImageProvider = ({ children }: ImageProviderProps) => {
  const [image, setImage] = useState<Image | null>({
    logo: '',
  });

  return (
    <ImageContext.Provider value={{ image, setImage }}>
      {children}
    </ImageContext.Provider>
  );
};
