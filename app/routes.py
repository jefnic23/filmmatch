import random
import pandas as pd
from datetime import datetime, timezone
from flask import render_template
from app.game import *
from app import app

@app.route('/') 
def index():
    today = datetime.now(timezone.utc).astimezone()
    year = int(today.today().timetuple().tm_year)
    day = int(today.today().timetuple().tm_yday) - 1
    cast = pd.read_csv('app/static/data/cast.csv')
    movies = pd.read_csv('app/static/data/movies.csv')
    actors = pd.read_csv('app/static/data/actors.csv')
    top = pd.concat([movies.iloc[:226], actors.iloc[:139]]).sample(frac=1, random_state=year)
    first = top.iloc[day].to_dict()
    first['answer'] = True
    current = first
    rollcall = []
    while True:
        try:
            random.seed(year+day)
            if current['category'] == 'primaryTitle':
                df = cast[cast['primaryTitle'] == current['name']]
                n = [v.to_dict() for k, v in actors[actors['name'].isin(df['nconst'].tolist())].iterrows() if v['name'] not in [x["name"] for y in rollcall for x in y] and v['name'] != first['name']]    
            else:
                df = cast[cast['nconst'] == current['name']]
                n = [v.to_dict() for k, v in movies[movies['name'].isin(df['primaryTitle'].tolist())].iterrows() if v['name'] not in [x["name"] for y in rollcall for x in y] and v['name'] != first['name']]
            current = random.choices(n, weights=[i['weight'] for i in n], k=1)[0]
            current['answer'] = True
            rollcall.append(getWrongAnswers(current, cast, actors, movies, year+day+current['weight']+len(rollcall)))
        except:
            break
    return render_template('index.html', first=first, data=rollcall, today=today)

if __name__ == '__main__':
    app.run()
