import React, { useState, useRef, useEffect, FC } from 'react';
import { Box, Collapse } from '@mui/material';

function getLineHeight(el: any) {
  try {
    var temp = document.createElement(el.nodeName),
      ret;
    temp.setAttribute(
      'style',
      'margin:0; padding:0; ' +
        'font-family:' +
        (el.style.fontFamily || 'inherit') +
        '; ' +
        'font-size:' +
        (el.style.fontSize || 'inherit')
    );
    temp.innerHTML = 'A';

    el.parentNode.appendChild(temp);
    ret = temp.clientHeight;
    temp.parentNode.removeChild(temp);

    return ret as number;
  } catch (e) {
    return 0;
  }
}

export interface Props {
  children: React.ReactNode;
  noOfLines?: number;
  lineHeight?: number;
  collapsedSize?: number;
  containerStyle?: React.CSSProperties;
  showMoreComponent?: React.ReactNode;
  showLessComponent?: React.ReactNode;
}

export interface LineProps {
  lines: number;
  height: number;
}

export const ReactSpoiler: FC<Props> = ({
  children,
  noOfLines = 4,
  lineHeight = 22.72,
  collapsedSize = 0,
  showMoreComponent = 'Show More',
  showLessComponent = 'Show Less',
  containerStyle = { marginTop: '1rem', color: 'green' },
}) => {
  const [readMore, setReadMore] = useState(false);
  const collapseRef = useRef<HTMLDivElement>();
  const lh = lineHeight ?? getLineHeight(collapseRef.current);
  const numberOfLines = noOfLines;
  const aboutHeight = lh * numberOfLines;
  const [lineDetail, setLineDetail] = useState<LineProps | null>({
    lines: 0,
    height: 0,
  });
  const [collapsedHeight, setCollapsedHeight] = useState<number | null>(null);

  useEffect(() => {
    const getLines = (): LineProps => {
      if (collapseRef.current) {
        var element = collapseRef.current;
        var height = element.getBoundingClientRect().height;
        return {
          lines: Math.ceil(height / lh),
          height: height,
        } as LineProps;
      } else {
        return { lines: 0, height: 0 } as LineProps;
      }
    };

    const getHeight = (): number => {
      if (collapseRef.current) {
        var element = collapseRef.current;
        var height = element.getBoundingClientRect().height;
        return height as number;
      } else {
        return 0;
      }
    };
    setLineDetail(getLines());
    window.addEventListener('resize', () => {
      setLineDetail(getLines());
      setCollapsedHeight(getHeight());
    });

    return () => {
      window.removeEventListener('resize', () => {
        setLineDetail(getLines());
        setCollapsedHeight(getHeight());
      });
    };
  }, [lh]);

  const getCollapsedSize = (): number => {
    if (collapsedSize > 0) return collapsedSize;
    return (lineDetail?.lines as number) <= noOfLines
      ? (lineDetail?.height as number)
      : aboutHeight;
  };

  const showToggle = (): boolean => {
    if (collapsedSize > 0 && collapsedHeight) {
      return collapsedSize < collapsedHeight;
    } else {
      return (lineDetail?.lines as number) > noOfLines;
    }
  };

  return (
    <div>
      <Collapse in={readMore} collapsedSize={getCollapsedSize()}>
        <Box ref={collapseRef}>{children}</Box>
      </Collapse>
      {showToggle() && (
        <Box
          style={{ ...containerStyle, cursor: 'pointer' }}
          onClick={() => {
            setReadMore(prev => !prev);
          }}
        >
          {!readMore ? showMoreComponent : showLessComponent}
        </Box>
      )}
    </div>
  );
};
