import e from "../assets/main";
import * as types from "../assets/types";
import Card from "../components/Card";
import Info from "../components/Info";
import {DataSnapshot, getDatabase, limitToFirst, limitToLast, onValue, query, ref, orderByChild, startAfter} from "@firebase/database";
import {update} from "firebase/database";
import React, {useEffect, useState} from "react";

const cache: {[id: string]: types.leaderboard[]} = {};

const Profile: () => JSX.Element = (): JSX.Element => {
  const [currentStat, setCurrentStat] = useState<types.stat>(e.stats.data[0]);
  const [leaderboard, setLeaderboard] = useState<types.leaderboard[]>([]);
  const [editingName, setEditingName] = useState<boolean>(false);
  const [username, setUsername] = useState<string>(String(e.storage.get("user-name")));

  useEffect((): void => {
    let statIndex: number = 0;

    e.stats.data.forEach((stat: types.stat, index: number): void => {
      if (stat.id === currentStat.id) statIndex = index;
    });

    onValue(query(ref(getDatabase(), "Users"), orderByChild("stats/" + statIndex + "/val"), startAfter(0), (statIndex !== 13 ? limitToLast : limitToFirst)(10)), (data: DataSnapshot): void => {
      const temp: types.leaderboard[] = [];
      data.forEach((user: DataSnapshot): void => {
        if (user.val().id === e.storage.get("user-id") && user.val().id) temp.push({id: user.val().id, name: "You", stat: user.val().stats[statIndex]?.val});
        else temp.push({id: user.val().id, name: user.val().name, stat: user.val().stats[statIndex]?.val});
      });

      if (statIndex !== 13) temp.reverse();
      setLeaderboard(temp);
    });
  }, [currentStat]);

  return (
    <div className="profile">
      <Card title="Username" type="title">
        {editingName ? (
          <div className="username">
            <div
              className="button material-icons"
              onClick={(): void => {
                if (username.length > 30) setUsername(username.slice(0, 30));
                e.storage.set("user-name", username);
                update(ref(getDatabase(), "Users/" + e.storage.get("user-id")), {
                  name: e.storage.get("user-name"),
                  stats: e.stats.data,
                });
                setEditingName(false);
              }}>
              done
            </div>
            <input
              type="text"
              className="input"
              key={"user-name-input"}
              defaultValue={String(e.storage.get("user-name"))}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                setUsername(event.target.value);
              }}></input>
          </div>
        ) : (
          <div className="username">
            <div
              className="button material-icons"
              onClick={(): void => {
                setEditingName(true);
              }}>
              edit
            </div>
            <p>{e.storage.get("user-name")}</p>
          </div>
        )}
        <br />
        <p>Your Username is used to identify you on leaderboards.</p>
      </Card>
      <Card title="Stats" type="title-collapsible" default={false}>
        {e.stats.data.map(
          (stat: types.stat): JSX.Element => (
            <div className="stat">
              <p>
                <b>{stat.game}</b> {stat.name}:
              </p>
              <div></div>
              <p>{e.stats.get(stat.id)}</p>
            </div>
          ),
        )}
      </Card>
      <Card title="Achievements" type="title-collapsible" default={false}>
        <div className="stat">
          <p>Progress:</p>
          <div></div>
          <p>
            {e.achievements.data.filter((achievement: types.achievement): boolean => e.achievements.get(achievement.id)).length}/{e.achievements.data.length}{" "}
            {Math.round((e.achievements.data.filter((achievement: types.achievement): boolean => e.achievements.get(achievement.id)).length / e.achievements.data.length) * 100)}%
          </p>
        </div>
        <progress max={e.achievements.data.length} value={e.achievements.data.filter((achievement: types.achievement): boolean => e.achievements.get(achievement.id)).length}></progress>
        {e.achievements.data.map(
          (achievement: types.achievement): JSX.Element => (
            <div className="stat">
              {achievement.secret && !e.achievements.get(achievement.id) ? "Secret Achievement" : achievement.name}:<div></div>
              {e.achievements.get(achievement.id) ? (
                <span className="material-icons" style={{color: "gold"}}>
                  lock_open
                </span>
              ) : (
                <span className="material-icons" style={{color: "grey"}}>
                  lock
                </span>
              )}
              <span style={{color: "gray", marginTop: "-1em", fontSize: "90%"}}>
                {achievement.game} | {achievement.secret && !e.achievements.get(achievement.id) ? "???" : achievement.description}
              </span>
            </div>
          ),
        )}
      </Card>
      <Card title="Leaderboards" type="title-collapsible" default={false}>
        <div className="setting dropdown">
          <select
            onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
              if (cache[JSON.parse(event.target.value)]) {
                setLeaderboard(cache[JSON.parse(event.target.value)]);
                return;
              }
              if (JSON.parse(event.target.value) !== currentStat) setCurrentStat(JSON.parse(event.target.value));
            }}>
            {e.stats.data.map(
              (stat: types.stat): JSX.Element => (
                <option key={stat.id} value={JSON.stringify(stat)}>
                  {stat.game} {stat.name}
                </option>
              ),
            )}
          </select>
        </div>
        {leaderboard.length > 0
          ? leaderboard.map((user: types.leaderboard): JSX.Element => {
              const trueIndex: number = leaderboard
                .filter((v: types.leaderboard): boolean => v.stat !== 0)
                .map((v: types.leaderboard): number => v.stat)
                .indexOf(user.stat);

              return (
                <>
                  {user.stat > 0 ? (
                    <div className="stat">
                      <p>
                        {trueIndex === 0 ? "🏆" : trueIndex === 1 ? "🥈" : trueIndex === 2 ? "🥉" : trueIndex + 1 + "th"}:{user.name?.length > 25 ? user.name?.substring(0, 25) + "..." : user.name}
                      </p>
                      <div></div>
                      <p>{user.stat}</p>
                    </div>
                  ) : null}
                </>
              );
            })
          : "Loading..."}
      </Card>
      <Info />
    </div>
  );
};

export default Profile;
